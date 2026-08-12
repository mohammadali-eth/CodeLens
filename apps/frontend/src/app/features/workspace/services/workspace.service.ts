import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError } from 'rxjs';
import JSZip from 'jszip';
import { detectLanguage as detectLangLower, getLanguageDisplayName } from '../utils/language-detector';

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: number;
  isFolder?: boolean;
}

export interface CodeIssueAnnotation {
  id: string;
  line: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  message: string;
  suggestion?: string;
}

export type AIProviderId = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'groq' | 'ollama';

export interface ProviderOption {
  id: AIProviderId;
  name: string;
  models: string[];
}

export const AI_PROVIDERS_CONFIG: ProviderOption[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    models: ['gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    models: ['claude-3-5-sonnet', 'claude-3-5-haiku'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    models: ['deepseek-coder-r1', 'deepseek-chat'],
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
  },
  {
    id: 'ollama',
    name: 'Ollama Local LLM',
    models: ['codellama:latest', 'deepseek-r1:latest'],
  },
];

const DEFAULT_INITIAL_FILES: WorkspaceFile[] = [
  {
    id: 'file-0',
    name: 'index.html',
    path: 'index.html',
    content: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CodeLens Enterprise</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
`,
    language: 'HTML',
    size: 285,
    lastModified: Date.now(),
  },
  {
    id: 'file-1',
    name: 'main.ts',
    path: 'src/main.ts',
    content: `// CodeLens Enterprise AI Code Review Workspace
import { Injectable } from '@angular/core';

export interface CodeAnalysisRequest {
  filename: string;
  content: string;
  language: string;
}

@Injectable({ providedIn: 'root' })
export class CodeReviewEngine {
  async analyze(request: CodeAnalysisRequest): Promise<Record<string, any>> {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return await response.json();
  }
}
`,
    language: 'TYPESCRIPT',
    size: 512,
    lastModified: Date.now(),
  },
  {
    id: 'file-2',
    name: 'styles.css',
    path: 'styles.css',
    content: `/* Global Application Stylesheet */
:root {
  --color-primary: #3b82f6;
  --color-background: #0b0f19;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background);
}
`,
    language: 'CSS',
    size: 195,
    lastModified: Date.now() - 1800000,
  },
];

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly API_BASE = '/api';

  // Core Reactive Signals
  readonly workspaceId = signal<string | null>(null);
  readonly files = signal<WorkspaceFile[]>(DEFAULT_INITIAL_FILES);
  readonly activeFileId = signal<string>('file-0');
  readonly searchQuery = signal<string>('');
  readonly reviewTitle = signal<string>('Workspace Security & Performance Audit');
  readonly selectedProvider = signal<AIProviderId>('gemini');
  readonly selectedModel = signal<string>('gemini-1.5-pro');
  readonly analysisDepth = signal<'quick' | 'standard' | 'deep' | 'custom'>('standard');

  // Pipeline Status Signals
  readonly isAnalyzing = signal<boolean>(false);
  readonly analysisProgress = signal<number>(0);
  readonly analysisStatusMessage = signal<string>('');
  readonly activeReviewResult = signal<any | null>(null);
  readonly activeAnnotations = signal<Record<string, CodeIssueAnnotation[]>>({});

  readonly uploading = signal<boolean>(false);
  readonly uploadProgress = signal<number>(0);

  // Computed Signals
  readonly activeFile = computed(() => {
    const list = this.files();
    const id = this.activeFileId();
    return list.find((f) => f.id === id) || list[0] || null;
  });

  readonly activeFileAnnotations = computed(() => {
    const active = this.activeFile();
    if (!active) return [];
    const map = this.activeAnnotations();
    return map[active.name] || map[active.path] || [];
  });

  readonly filteredFiles = computed(() => {
    const list = this.files();
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q),
    );
  });

  readonly availableModels = computed(() => {
    const providerId = this.selectedProvider();
    const provider = AI_PROVIDERS_CONFIG.find((p) => p.id === providerId);
    return provider ? provider.models : ['default-model'];
  });

  constructor() {
    if (this.isBrowser) {
      this.initWorkspaceSession();
    }
  }

  // --- Session & DB Synchronization ---

  initWorkspaceSession(): void {
    const cached = localStorage.getItem('codelens_workspace_id');
    if (cached) {
      this.workspaceId.set(cached);
      this.loadWorkspaceFromBackend(cached);
    } else {
      this.createWorkspaceInBackend();
    }
  }

  createWorkspaceInBackend(): void {
    const payload = {
      name: this.reviewTitle(),
      description: 'Persistent Cloud IDE workspace session',
      files: this.files().map((f) => ({
        filename: f.name,
        path: f.path,
        content: f.content,
        language: this.detectLanguage(f.name, f.content),
      })),
    };

    this.http.post<any>(`${this.API_BASE}/workspaces`, payload).pipe(
      tap((ws) => {
        if (ws && ws.id) {
          this.workspaceId.set(ws.id);
          localStorage.setItem('codelens_workspace_id', ws.id);
        }
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  loadWorkspaceFromBackend(id: string): void {
    this.http.get<any>(`${this.API_BASE}/workspaces/${id}`).pipe(
      tap((ws) => {
        if (ws && ws.files && ws.files.length > 0) {
          const loadedFiles: WorkspaceFile[] = ws.files.map((f: any) => {
            const filename = f.filename || f.path || 'untitled';
            return {
              id: f.id,
              name: filename,
              path: f.path || filename,
              content: f.content,
              language: this.detectLanguage(filename, f.content),
              size: f.fileSize || f.content.length,
              lastModified: new Date(f.updatedAt).getTime(),
            };
          });
          this.files.set(loadedFiles);
          this.activeFileId.set(loadedFiles[0].id);
        }
      }),
      catchError(() => {
        this.createWorkspaceInBackend();
        return of(null);
      })
    ).subscribe();
  }

  // --- File Management ---

  setActiveFile(fileId: string): void {
    this.activeFileId.set(fileId);
  }

  updateActiveFileContent(content: string): void {
    const active = this.activeFile();
    if (!active) return;

    this.files.update((list) =>
      list.map((f) => (f.id === active.id ? { ...f, content, size: content.length } : f)),
    );

    // Sync file content to backend
    const wsId = this.workspaceId();
    if (wsId) {
      this.http.post(`${this.API_BASE}/workspaces/${wsId}/files`, {
        files: [{ filename: active.name, path: active.path, content, language: active.language }],
      }).subscribe();
    }
  }

  deleteFile(fileId: string): void {
    const fileToDelete = this.files().find((f) => f.id === fileId);
    this.files.update((list) => list.filter((f) => f.id !== fileId));
    
    const current = this.files();
    if (current.length > 0) {
      this.activeFileId.set(current[0].id);
    }

    const wsId = this.workspaceId();
    if (wsId && fileToDelete) {
      this.http.delete(`${this.API_BASE}/workspaces/${wsId}/files/${fileToDelete.id}`).subscribe();
    }
  }

  setProvider(providerId: AIProviderId): void {
    this.selectedProvider.set(providerId);
    const models = this.availableModels();
    if (models.length > 0) {
      this.selectedModel.set(models[0]);
    }
  }

  setModel(model: string): void {
    this.selectedModel.set(model);
  }

  setAnalysisDepth(depth: 'quick' | 'standard' | 'deep' | 'custom'): void {
    this.analysisDepth.set(depth);
  }

  setReviewTitle(title: string): void {
    this.reviewTitle.set(title);
  }

  // --- File Upload & ZIP Extraction ---

  async handleFileListUpload(fileList: FileList | File[]): Promise<void> {
    this.uploading.set(true);
    this.uploadProgress.set(10);

    const filesArray = Array.from(fileList);
    const newFiles: WorkspaceFile[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];

      if (file.name.endsWith('.zip')) {
        const zipFiles = await this.extractZipFile(file);
        newFiles.push(...zipFiles);
      } else {
        const textContent = await this.readFileAsText(file);
        const relPath = (file as any).webkitRelativePath || file.name;
        newFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          path: relPath,
          content: textContent,
          language: this.detectLanguage(file.name, textContent),
          size: file.size,
          lastModified: file.lastModified || Date.now(),
        });
      }

      const pct = Math.min(90, Math.round(((i + 1) / filesArray.length) * 100));
      this.uploadProgress.set(pct);
    }

    if (newFiles.length > 0) {
      this.files.update((existing) => [...existing, ...newFiles]);
      this.activeFileId.set(newFiles[0].id);

      // Sync updated workspace files to backend
      const wsId = this.workspaceId();
      if (wsId) {
        this.http.post(`${this.API_BASE}/workspaces/${wsId}/files`, {
          files: newFiles.map((f) => ({
            filename: f.name,
            path: f.path,
            content: f.content,
            language: f.language,
          })),
        }).subscribe();
      }
    }

    this.uploadProgress.set(100);
    this.uploading.set(false);
  }

  private async extractZipFile(zipFile: File): Promise<WorkspaceFile[]> {
    const zip = new JSZip();
    const contents = await zip.loadAsync(zipFile);
    const extracted: WorkspaceFile[] = [];

    for (const relativePath of Object.keys(contents.files)) {
      const zipObj = contents.files[relativePath];
      if (
        zipObj.dir ||
        relativePath.includes('node_modules/') ||
        relativePath.includes('.git/') ||
        relativePath.includes('dist/') ||
        relativePath.includes('.next/')
      ) {
        continue;
      }

      try {
        const textContent = await zipObj.async('text');
        const filename = relativePath.split('/').pop() || relativePath;
        extracted.push({
          id: `zip-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: filename,
          path: relativePath,
          content: textContent,
          language: this.detectLanguage(filename, textContent),
          size: textContent.length,
          lastModified: Date.now(),
        });
      } catch {
        // Skip binary file
      }
    }

    return extracted;
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  }

  // --- Real AI Review Execution Pipeline & Diagnostics ---

  submitAIReview(): Observable<any> {
    const currentFiles = this.files();
    if (currentFiles.length === 0) {
      return of({ error: 'No files available in workspace' });
    }

    this.isAnalyzing.set(true);
    this.analysisProgress.set(15);
    this.analysisStatusMessage.set('Stage 1/5: Uploading project files to sandbox...');

    const payload = {
      title: this.reviewTitle(),
      description: `Analysis Depth: ${this.analysisDepth().toUpperCase()}`,
      aiProvider: this.selectedProvider(),
      aiModel: this.selectedModel(),
      analysisDepth: this.analysisDepth(),
      workspaceId: this.workspaceId() || undefined,
      files: currentFiles.map((f) => ({
        filename: f.name,
        path: f.path,
        content: f.content,
        language: f.language,
      })),
    };

    return this.http.post<any>(`${this.API_BASE}/reviews`, payload).pipe(
      tap((createdReview) => {
        this.analysisProgress.set(40);
        this.analysisStatusMessage.set(`Stage 2/5: Language detection & AST parsing...`);

        const reviewId = createdReview.id || createdReview.reviewId;
        if (reviewId) {
          setTimeout(() => {
            this.analysisProgress.set(65);
            this.analysisStatusMessage.set(`Stage 3/5: Executing ${this.selectedProvider().toUpperCase()} multi-pass LLM audit...`);
            
            this.triggerAIAnalysis(reviewId).subscribe();
          }, 600);
        }
      }),
      catchError((err) => {
        this.isAnalyzing.set(false);
        const errMsg = err?.error?.message || err?.message || 'Failed to submit code review job';
        this.analysisStatusMessage.set(`Review Submission Failed: ${errMsg}`);
        this.activeReviewResult.set({
          status: 'FAILED',
          summary: errMsg,
          score: null,
          files: [],
        });
        return of(null);
      })
    );
  }

  private triggerAIAnalysis(reviewId: string): Observable<any> {
    const provider = this.selectedProvider();
    return this.http.post<any>(`${this.API_BASE}/ai/analyze/${reviewId}?provider=${provider}`, {}).pipe(
      tap((result) => {
        this.analysisProgress.set(90);
        this.analysisStatusMessage.set('Stage 4/5: Normalizing issue callouts and line annotations...');
        
        this.processReviewResults(result);

        setTimeout(() => {
          this.analysisProgress.set(100);
          this.analysisStatusMessage.set('Stage 5/5: Code Review Audit Completed');
          this.isAnalyzing.set(false);

          // Navigate to review diagnostics page
          this.router.navigate(['/reviews', reviewId]);
        }, 500);
      }),
      catchError((err) => {
        this.isAnalyzing.set(false);
        const errMsg = err?.error?.message || err?.message || 'AI engine failed to execute analysis';
        this.analysisStatusMessage.set(`AI Analysis Failed: ${errMsg}`);
        this.activeReviewResult.set({
          id: reviewId,
          status: 'FAILED',
          summary: `Analysis Error: ${errMsg}`,
          score: null,
          aiProvider: provider,
          aiModel: this.selectedModel(),
          files: [],
        });
        this.router.navigate(['/reviews', reviewId]);
        return of(null);
      })
    );
  }

  private processReviewResults(reviewData: any): void {
    this.activeReviewResult.set(reviewData);

    // Map inline file annotations
    const annotationsMap: Record<string, CodeIssueAnnotation[]> = {};
    if (reviewData && reviewData.files) {
      for (const file of reviewData.files) {
        if (file.issues && file.issues.length > 0) {
          annotationsMap[file.filename] = file.issues.map((i: any) => ({
            id: i.id || `issue-${Math.random()}`,
            line: i.line || 1,
            severity: i.severity || 'MEDIUM',
            category: i.category || 'QUALITY',
            message: i.message,
            suggestion: i.suggestion,
          }));
        }
      }
    }

    this.activeAnnotations.set(annotationsMap);
  }

  exportReport(format: 'pdf' | 'markdown' | 'json' | 'csv'): void {
    const review = this.activeReviewResult();
    const reviewId = review?.id || 'latest';
    const url = `${this.API_BASE}/reviews/${reviewId}/report`;
    window.open(url, '_blank');
  }

  detectLanguage(filename: string, content?: string): string {
    return getLanguageDisplayName(filename || 'plaintext');
  }
}
