import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, finalize } from 'rxjs';
import JSZip from 'jszip';

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
    models: ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro'],
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
    name: 'app.service.ts',
    path: 'src/app.service.ts',
    content: `// Application Core Service
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  getData(): string {
    return 'CodeLens AI Review Platform';
  }
}
`,
    language: 'TYPESCRIPT',
    size: 210,
    lastModified: Date.now() - 3600000,
  },
  {
    id: 'file-3',
    name: 'review.controller.ts',
    path: 'src/review.controller.ts',
    content: `// NestJS API Controller
import { Controller, Post, Body } from '@nestjs/common';

@Controller('reviews')
export class ReviewController {
  @Post()
  async createReview(@Body() body: any) {
    return { status: 'QUEUED', id: 'REV-101' };
  }
}
`,
    language: 'TYPESCRIPT',
    size: 240,
    lastModified: Date.now() - 7200000,
  },
];

/**
 * WorkspaceService
 * Purpose: Centralized state manager for the interactive Cloud IDE AI Code Review Workspace.
 * Responsibilities: Real file uploads, drag & drop, ZIP extraction, active file selection, AI provider configuration, and review pipeline execution.
 * Dependencies: HttpClient, Router, JSZip.
 */
@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly API_BASE = 'http://localhost:4000';

  // Signals State
  readonly files = signal<WorkspaceFile[]>(DEFAULT_INITIAL_FILES);
  readonly activeFileId = signal<string>('file-1');
  readonly searchQuery = signal<string>('');
  readonly reviewTitle = signal<string>('Workspace Code Audit');
  readonly selectedProvider = signal<AIProviderId>('gemini');
  readonly selectedModel = signal<string>('gemini-2.5-pro');
  readonly analysisDepth = signal<'quick' | 'standard' | 'deep' | 'custom'>('standard');

  // Pipeline Status Signals
  readonly isAnalyzing = signal<boolean>(false);
  readonly analysisProgress = signal<number>(0);
  readonly analysisStatusMessage = signal<string>('');
  readonly lastAnalysisResult = signal<any | null>(null);

  readonly uploading = signal<boolean>(false);
  readonly uploadProgress = signal<number>(0);

  // Computed Signals
  readonly activeFile = computed(() => {
    const list = this.files();
    const id = this.activeFileId();
    return list.find((f) => f.id === id) || list[0] || null;
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
      this.loadFromCache();
    }
  }

  // --- File Actions ---

  setActiveFile(fileId: string): void {
    this.activeFileId.set(fileId);
    this.saveToCache();
  }

  updateActiveFileContent(content: string): void {
    const active = this.activeFile();
    if (!active) return;

    this.files.update((list) =>
      list.map((f) => (f.id === active.id ? { ...f, content, size: content.length } : f)),
    );
    this.saveToCache();
  }

  deleteFile(fileId: string): void {
    this.files.update((list) => list.filter((f) => f.id !== fileId));
    const current = this.files();
    if (current.length > 0) {
      this.activeFileId.set(current[0].id);
    }
    this.saveToCache();
  }

  setProvider(providerId: AIProviderId): void {
    this.selectedProvider.set(providerId);
    const models = this.availableModels();
    if (models.length > 0) {
      this.selectedModel.set(models[0]);
    }
    this.saveToCache();
  }

  setModel(model: string): void {
    this.selectedModel.set(model);
    this.saveToCache();
  }

  setAnalysisDepth(depth: 'quick' | 'standard' | 'deep' | 'custom'): void {
    this.analysisDepth.set(depth);
    this.saveToCache();
  }

  setReviewTitle(title: string): void {
    this.reviewTitle.set(title);
    this.saveToCache();
  }

  // --- Upload Ingestion ---

  async handleFileListUpload(fileList: FileList | File[]): Promise<void> {
    this.uploading.set(true);
    this.uploadProgress.set(10);

    const filesArray = Array.from(fileList);
    const newFiles: WorkspaceFile[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];

      // If ZIP file, extract archive
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
          language: this.detectLanguage(file.name),
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
    }

    this.uploadProgress.set(100);
    this.uploading.set(false);
    this.saveToCache();
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
        relativePath.includes('dist/')
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
          language: this.detectLanguage(filename),
          size: textContent.length,
          lastModified: Date.now(),
        });
      } catch {
        // Skip binary unreadable files
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

  // --- Submit AI Review Core Execution Pipeline ---

  submitAIReview(): Observable<any> {
    const currentFiles = this.files();
    if (currentFiles.length === 0) {
      return of({ error: 'No files available in workspace for review' });
    }

    this.isAnalyzing.set(true);
    this.analysisProgress.set(15);
    this.analysisStatusMessage.set('Initializing AI Static Analysis Pipeline...');

    const payload = {
      title: this.reviewTitle(),
      description: `Analysis Depth: ${this.analysisDepth().toUpperCase()}`,
      aiProvider: this.selectedProvider(),
      aiModel: this.selectedModel(),
      files: currentFiles.map((f) => ({
        filename: f.name,
        content: f.content,
        language: f.language,
      })),
    };

    return this.http.post<any>(`${this.API_BASE}/reviews`, payload).pipe(
      tap((createdReview: any) => {
        this.analysisProgress.set(50);
        this.analysisStatusMessage.set(`Executing ${this.selectedProvider().toUpperCase()} LLM inspection...`);

        const reviewId = createdReview.id || createdReview.reviewId;
        if (reviewId) {
          this.triggerAIAnalysis(reviewId).subscribe();
        }
      }),
      catchError((err) => {
        this.isAnalyzing.set(false);
        this.analysisStatusMessage.set('Failed to submit code review job');
        return of(null);
      })
    );
  }

  private triggerAIAnalysis(reviewId: string): Observable<any> {
    const provider = this.selectedProvider();
    return this.http.post<any>(`${this.API_BASE}/ai/analyze/${reviewId}?provider=${provider}`, {}).pipe(
      tap((result) => {
        this.analysisProgress.set(100);
        this.analysisStatusMessage.set('Code Review Audit Completed Successfully');
        this.lastAnalysisResult.set(result);
        this.isAnalyzing.set(false);

        // Navigate to diagnostics view
        this.router.navigate(['/reviews', reviewId]);
      }),
      catchError(() => {
        this.analysisProgress.set(100);
        this.isAnalyzing.set(false);
        this.analysisStatusMessage.set('AI analysis encountered an error');
        return of(null);
      })
    );
  }

  // --- Helper Methods ---

  detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'TYPESCRIPT';
      case 'js':
      case 'jsx':
      case 'mjs':
        return 'JAVASCRIPT';
      case 'py':
        return 'PYTHON';
      case 'java':
        return 'JAVA';
      case 'cpp':
      case 'c':
      case 'h':
      case 'hpp':
        return 'CPP';
      case 'cs':
        return 'CSHARP';
      case 'go':
        return 'GO';
      case 'rs':
        return 'RUST';
      case 'php':
        return 'PHP';
      case 'kt':
      case 'kts':
        return 'KOTLIN';
      case 'swift':
        return 'SWIFT';
      case 'sql':
        return 'SQL';
      case 'json':
        return 'JSON';
      case 'yaml':
      case 'yml':
        return 'YAML';
      case 'md':
        return 'MARKDOWN';
      default:
        return 'TYPESCRIPT';
    }
  }

  private saveToCache(): void {
    if (!this.isBrowser) return;
    try {
      const state = {
        files: this.files(),
        activeFileId: this.activeFileId(),
        reviewTitle: this.reviewTitle(),
        selectedProvider: this.selectedProvider(),
        selectedModel: this.selectedModel(),
        analysisDepth: this.analysisDepth(),
      };
      localStorage.setItem('codelens_active_workspace', JSON.stringify(state));
    } catch {
      // Ignore write errors
    }
  }

  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem('codelens_active_workspace');
      if (cached) {
        const state = JSON.parse(cached);
        if (state.files && Array.isArray(state.files) && state.files.length > 0) {
          this.files.set(state.files);
        }
        if (state.activeFileId) this.activeFileId.set(state.activeFileId);
        if (state.reviewTitle) this.reviewTitle.set(state.reviewTitle);
        if (state.selectedProvider) this.selectedProvider.set(state.selectedProvider);
        if (state.selectedModel) this.selectedModel.set(state.selectedModel);
        if (state.analysisDepth) this.analysisDepth.set(state.analysisDepth);
      }
    } catch {
      // Fallback to initial
    }
  }
}
