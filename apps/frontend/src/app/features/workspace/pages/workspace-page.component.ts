import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService, AIProviderId, AI_PROVIDERS_CONFIG, CodeIssueAnnotation } from '../services/workspace.service';
import { EditorManagerService } from '../../settings/services/editor-manager.service';

/**
 * WorkspacePageComponent
 * Purpose: Production-grade AI Code Review Cloud IDE Workspace.
 * Features:
 *  - Persistent backend Workspace & File management (/workspaces)
 *  - Single/Multi-file upload, Folder ingestion, JSZip archive extraction, Drag & Drop
 *  - Dynamic AI Provider & Model list selection (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama)
 *  - Real AI static analysis execution with progress streaming
 *  - Inline Code Annotations (line-by-line severity callouts, bug indicators, AI suggestions)
 *  - Exporting PDF, Markdown, JSON, and CSV reports
 */
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cdl-workspace-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="workspace-page-container animate-fade-in"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      [class.drag-active]="isDragging"
    >
      <!-- Drag & Drop Global Overlay -->
      <div class="drag-drop-overlay" *ngIf="isDragging">
        <div class="drop-modal">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <h3>Drop Code Files, Folders, or ZIP Archives Here</h3>
          <p>Import code directly into your persistent AI Code Review Workspace</p>
        </div>
      </div>

      <!-- Header Bar -->
      <header class="workspace-header">
        <div class="header-left">
          <h2>Code Review Workspace</h2>
          <span class="badge badge-primary">Cloud IDE</span>
          <span class="active-title-pill">{{ ws.reviewTitle() }}</span>
        </div>

        <div class="header-actions">
          <!-- Hidden Native File Inputs -->
          <input type="file" #fileInput multiple style="display:none" (change)="onFilesSelected($event)" />
          <input type="file" #folderInput webkitdirectory style="display:none" (change)="onFolderSelected($event)" />
          <input type="file" #zipInput accept=".zip" style="display:none" (change)="onZipSelected($event)" />

          <!-- Upload Actions Dropdown -->
          <div class="upload-dropdown-wrap">
            <button class="btn btn-secondary btn-sm" (click)="toggleUploadMenu()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload Code</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <div class="upload-menu" *ngIf="showUploadMenu">
              <button (click)="fileInput.click(); showUploadMenu = false">
                <span>📄 Single/Multiple Files</span>
              </button>
              <button (click)="folderInput.click(); showUploadMenu = false">
                <span>📁 Entire Folder Ingestion</span>
              </button>
              <button (click)="zipInput.click(); showUploadMenu = false">
                <span>📦 ZIP Archive Unzipping</span>
              </button>
            </div>
          </div>

          <!-- Report Exporter Dropdown -->
          <div class="upload-dropdown-wrap" *ngIf="ws.activeReviewResult()">
            <button class="btn btn-secondary btn-sm" (click)="toggleExportMenu()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Export Report</span>
            </button>

            <div class="upload-menu" *ngIf="showExportMenu">
              <button (click)="ws.exportReport('markdown'); showExportMenu = false">📝 Export Markdown (.md)</button>
              <button (click)="ws.exportReport('pdf'); showExportMenu = false">📕 Export PDF Report</button>
              <button (click)="ws.exportReport('json'); showExportMenu = false">⚙️ Export JSON Data</button>
              <button (click)="ws.exportReport('csv'); showExportMenu = false">📊 Export CSV Table</button>
            </div>
          </div>

          <!-- Submit AI Review Button -->
          <button
            class="btn btn-primary btn-sm"
            [disabled]="ws.isAnalyzing() || ws.files().length === 0"
            (click)="onSubmitReview()"
          >
            <ng-container *ngIf="!ws.isAnalyzing()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Submit AI Review</span>
            </ng-container>
            <ng-container *ngIf="ws.isAnalyzing()">
              <span class="spinner-sm"></span>
              <span>Analyzing...</span>
            </ng-container>
          </button>
        </div>
      </header>

      <!-- AI Pipeline Progress Bar Banner -->
      <div class="analysis-progress-banner" *ngIf="ws.isAnalyzing()">
        <div class="progress-info">
          <span class="pulse-dot"></span>
          <span class="status-msg">{{ ws.analysisStatusMessage() }}</span>
          <span class="pct-val">{{ ws.analysisProgress() }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar" [style.width.%]="ws.analysisProgress()"></div>
        </div>
      </div>

      <!-- Main Workspace 3-Column Layout -->
      <div class="workspace-grid">
        <!-- Left Column: File Explorer -->
        <aside class="sidebar">
          <div class="sidebar-section-header">
            <h3>File Explorer</h3>
            <span class="file-count">{{ ws.filteredFiles().length }} Files</span>
          </div>

          <!-- Search Filter -->
          <div class="explorer-search">
            <input
              type="text"
              placeholder="Search files..."
              [ngModel]="ws.searchQuery()"
              (ngModelChange)="ws.searchQuery.set($event)"
              class="search-input"
            />
          </div>

          <!-- File List Tree -->
          <ul class="file-list">
            <li
              *ngFor="let file of ws.filteredFiles()"
              [class.active]="file.id === ws.activeFileId()"
              (click)="ws.setActiveFile(file.id)"
            >
              <span class="lang-icon-badge" [class]="file.language.toLowerCase()">
                {{ getLanguageSymbol(file.language) }}
              </span>
              <span class="file-name" [title]="file.path">{{ file.name }}</span>
              
              <button
                class="file-delete-btn"
                title="Delete file"
                (click)="$event.stopPropagation(); ws.deleteFile(file.id)"
              >
                ×
              </button>
              <span class="active-dot" *ngIf="file.id === ws.activeFileId()"></span>
            </li>

            <div class="empty-files-state" *ngIf="ws.filteredFiles().length === 0">
              <p>No files match search filter.</p>
            </div>
          </ul>
        </aside>

        <!-- Center Column: Monaco / Code Viewport Editor -->
        <main class="editor-container">
          <div class="editor-placeholder" *ngIf="ws.activeFile() as file">
            <!-- Tab Bar & Metadata -->
            <div class="editor-header">
              <div class="tab-item active">
                <span class="lang-icon-badge" [class]="file.language.toLowerCase()">
                  {{ getLanguageSymbol(file.language) }}
                </span>
                <span>{{ file.name }}</span>
              </div>

              <div class="editor-meta">
                <button class="btn-copy" (click)="copyCode(file.content)">
                  <span>{{ copied ? 'Copied!' : 'Copy Code' }}</span>
                </button>
                <span class="lang-tag">{{ file.language }}</span>
                <span class="encoding-tag">UTF-8</span>
                <span class="size-tag">{{ (file.size / 1024) | number:'1.1-1' }} KB</span>
              </div>
            </div>

            <!-- Interactive Code Viewport -->
            <div class="code-editor-viewport">
              <div class="line-numbers" *ngIf="editorManager.lineNumbers() !== 'off'">
                <ng-container *ngFor="let line of getLines(file.content); let i = index">
                  <div class="line-num-cell" [class.has-issue]="getAnnotationForLine(i + 1)">
                    <span>{{ getLineNumberDisplay(i + 1) }}</span>
                    <span class="issue-indicator" *ngIf="getAnnotationForLine(i + 1) as annotation" [class]="annotation.severity.toLowerCase()">
                      ⚠️
                    </span>
                  </div>
                </ng-container>
              </div>

              <div class="editor-text-wrap">
                <pre class="code-highlight-backdrop" aria-hidden="true"><code [innerHTML]="getHighlightedCode(file.content, file.language)"></code></pre>
                <textarea
                  class="code-preview"
                  [ngModel]="file.content"
                  (ngModelChange)="ws.updateActiveFileContent($event)"
                  (scroll)="onEditorScroll($event)"
                  spellcheck="false"
                ></textarea>

                <!-- Inline Annotations Hover overlay list -->
                <div class="annotations-overlay-panel" *ngIf="ws.activeFileAnnotations().length > 0">
                  <div class="annotation-card" *ngFor="let issue of ws.activeFileAnnotations()">
                    <div class="annotation-header">
                      <span class="badge" [class]="'badge-' + issue.severity.toLowerCase()">{{ issue.severity }}</span>
                      <span class="annotation-line">Line {{ issue.line }}</span>
                      <span class="annotation-cat">{{ issue.category }}</span>
                    </div>
                    <div class="annotation-msg">{{ issue.message }}</div>
                    <div class="annotation-sug" *ngIf="issue.suggestion">
                      💡 <strong>Fix:</strong> {{ issue.suggestion }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="editor-minimap-gutter" *ngIf="editorManager.minimap()">
                <div class="minimap-sim-line" *ngFor="let line of getLines(file.content).slice(0, 15); let i = index" [style.width.%]="(i * 17 + 40) % 90 + 10"></div>
              </div>
            </div>
          </div>
        </main>

        <!-- Right Column: AI Review Settings Panel -->
        <aside class="context-panel">
          <div class="panel-header">
            <h3>AI Review Settings</h3>
            <span class="badge badge-primary">Config</span>
          </div>

          <!-- Review Title Input -->
          <div class="form-group">
            <label>Review Title</label>
            <input
              type="text"
              [ngModel]="ws.reviewTitle()"
              (ngModelChange)="ws.setReviewTitle($event)"
              class="form-input"
            />
          </div>

          <!-- AI Provider Select -->
          <div class="form-group">
            <label>AI Provider</label>
            <select
              class="form-select"
              [ngModel]="ws.selectedProvider()"
              (ngModelChange)="onProviderChange($any($event.target).value)"
            >
              <option *ngFor="let p of providersConfig" [value]="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <!-- Dynamic AI Model Select -->
          <div class="form-group">
            <label>LLM Model</label>
            <select
              class="form-select"
              [ngModel]="ws.selectedModel()"
              (ngModelChange)="ws.setModel($event)"
            >
              <option *ngFor="let m of ws.availableModels()" [value]="m">
                {{ m }}
              </option>
            </select>
          </div>

          <!-- Analysis Depth Control -->
          <div class="form-group">
            <label>Analysis Depth</label>
            <div class="segmented-control">
              <button
                class="segment-btn"
                [class.active]="ws.analysisDepth() === 'quick'"
                (click)="ws.setAnalysisDepth('quick')"
              >
                Quick
              </button>
              <button
                class="segment-btn"
                [class.active]="ws.analysisDepth() === 'standard'"
                (click)="ws.setAnalysisDepth('standard')"
              >
                Standard
              </button>
              <button
                class="segment-btn"
                [class.active]="ws.analysisDepth() === 'deep'"
                (click)="ws.setAnalysisDepth('deep')"
              >
                Deep
              </button>
            </div>
          </div>

          <!-- Diagnostic Review Score Result Card -->
          <div class="score-result-card" *ngIf="ws.activeReviewResult() as res">
            <div class="score-header">
              <span class="score-badge" [class.badge-failed]="res.status === 'FAILED'" [style.background]="res.status === 'FAILED' ? '#fee2e2' : undefined" [style.color]="res.status === 'FAILED' ? '#dc2626' : undefined">
                {{ res.status === 'FAILED' ? 'FAILED' : ((res.score !== null && res.score !== undefined) ? res.score + '/100' : 'N/A') }}
              </span>
              <span class="score-title">{{ res.status === 'FAILED' ? 'Analysis Failed' : 'Overall Quality Score' }}</span>
            </div>
            <p class="score-summary">{{ res.summary }}</p>
            <a *ngIf="res.id" [routerLink]="['/reviews', res.id]" class="btn btn-primary btn-sm btn-full-report" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; width: 100%;">
              <span>View Diagnostics Report</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          <!-- Dynamic Info Pre-Check Card -->
          <div class="info-card" *ngIf="!ws.activeReviewResult()">
            <div class="info-title">✨ {{ ws.selectedProvider() | uppercase }} Multi-pass Engine</div>
            <p class="info-desc">
              Model <strong>{{ ws.selectedModel() }}</strong> will audit security vulnerabilities, type safety, memory leaks, and time complexity.
            </p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .workspace-page-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      background: var(--bg-app);
      color: var(--text-primary);
      position: relative;
    }

    .drag-drop-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drop-modal {
      background: var(--bg-surface);
      border: 2px dashed var(--color-primary);
      border-radius: var(--radius-xl);
      padding: 3rem 4rem;
      text-align: center;
      box-shadow: var(--shadow-xl);
    }
    .drop-modal h3 { margin: 1rem 0 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
    .drop-modal p { margin: 0; font-size: 0.875rem; color: var(--text-muted); }

    .workspace-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-surface);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .header-left h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .active-title-pill {
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-color);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      color: var(--text-secondary);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      position: relative;
    }

    .upload-dropdown-wrap {
      position: relative;
    }

    .upload-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 6px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      width: 220px;
      z-index: 500;
      overflow: hidden;
    }

    .upload-menu button {
      background: transparent;
      border: none;
      padding: 0.65rem 1rem;
      text-align: left;
      font-size: 0.8125rem;
      color: var(--text-primary);
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .upload-menu button:hover {
      background: var(--bg-surface-secondary);
    }

    .analysis-progress-banner {
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      padding: 0.6rem 1.5rem;
    }

    .progress-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3b82f6;
      box-shadow: 0 0 8px #3b82f6;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    .status-msg {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #93c5fd;
      flex: 1;
    }

    .pct-val {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #60a5fa;
    }

    .progress-track {
      height: 4px;
      background: #1e293b;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #3b82f6);
      transition: width 0.3s ease;
    }

    .workspace-grid {
      display: grid;
      grid-template-columns: 260px 1fr 300px;
      flex: 1;
      overflow: hidden;
    }

    .sidebar, .context-panel {
      background: var(--bg-surface);
      padding: 1.25rem;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }

    .context-panel {
      border-right: none;
      border-left: 1px solid var(--border-color);
    }

    .sidebar-section-header, .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .sidebar h3, .context-panel h3 {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      font-weight: 700;
      margin: 0;
    }

    .file-count {
      font-size: 0.7rem;
      color: var(--text-subtle);
      font-weight: 600;
    }

    .explorer-search {
      margin-bottom: 0.75rem;
    }

    .search-input {
      width: 100%;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.4rem 0.75rem;
      font-size: 0.8125rem;
      color: var(--text-primary);
      outline: none;
      box-sizing: border-box;
    }
    .search-input:focus {
      border-color: var(--color-primary);
    }

    .file-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow-y: auto;
      flex: 1;
    }

    .file-list li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.15s ease;
      position: relative;
    }

    .file-list li.active {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 600;
    }

    .file-list li:hover:not(.active) {
      background: var(--bg-surface-secondary);
      color: var(--text-primary);
    }

    .file-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-delete-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1rem;
      cursor: pointer;
      display: none;
      padding: 0 4px;
    }

    .file-list li:hover .file-delete-btn {
      display: block;
    }
    .file-delete-btn:hover {
      color: #ef4444;
    }

    .lang-icon-badge {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      background: #e2e8f0;
      color: #475569;
    }
    .lang-icon-badge.typescript { background: #eff6ff; color: #2563eb; }
    .lang-icon-badge.javascript { background: #fefce8; color: #ca8a04; }
    .lang-icon-badge.python { background: #ecfdf5; color: #059669; }
    .lang-icon-badge.java { background: #fff7ed; color: #ea580c; }
    .lang-icon-badge.go { background: #e0f2fe; color: #0284c7; }
    .lang-icon-badge.rust { background: #fef2f2; color: #dc2626; }

    .active-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-primary);
    }

    .editor-container {
      background: var(--bg-app);
      padding: 1rem;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .editor-placeholder {
      background: #0f172a;
      border-radius: var(--radius-lg);
      border: 1px solid #1e293b;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      height: 38px;
    }

    .tab-item.active {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #0f172a;
      color: #f8fafc;
      padding: 0 0.85rem;
      height: 38px;
      font-size: 0.8rem;
      font-weight: 600;
      border-top: 2px solid #3b82f6;
    }

    .editor-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.7rem;
      color: #94a3b8;
    }

    .btn-copy {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      cursor: pointer;
    }
    .btn-copy:hover { background: rgba(255, 255, 255, 0.2); }

    .lang-tag { color: #60a5fa; font-weight: 600; }
    .encoding-tag { color: #94a3b8; }
    .size-tag { color: #64748b; }

    .code-editor-viewport {
      display: flex;
      flex: 1;
      padding: 1rem 0;
      overflow: hidden;
      position: relative;
    }

    .line-numbers {
      display: flex;
      flex-direction: column;
      padding: 0 0.85rem 0 1rem;
      color: #475569;
      user-select: none;
      text-align: right;
      font-family: var(--editor-font-family, 'Fira Code', monospace);
      font-size: var(--editor-font-size, 14px);
      line-height: 1.6;
    }

    .line-num-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: flex-end;
    }
    .line-num-cell.has-issue {
      color: #ef4444;
      font-weight: bold;
    }

    .issue-indicator {
      font-size: 0.7rem;
    }

    .editor-text-wrap {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .code-highlight-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 0 1rem;
      font-family: var(--editor-font-family, 'Fira Code', monospace);
      font-size: var(--editor-font-size, 14px);
      line-height: 1.6;
      white-space: pre;
      overflow: hidden;
      pointer-events: none;
      box-sizing: border-box;
      color: #e2e8f0;
      tab-size: var(--editor-tab-size, 2);
    }

    .code-highlight-backdrop code {
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      white-space: pre;
      display: block;
    }

    .syn-comment { color: #7f848e; font-style: italic; }
    .syn-string { color: #98c379; }
    .syn-decorator { color: #e5c07b; font-weight: 600; }
    .syn-keyword { color: #c678dd; font-weight: 600; }
    .syn-type { color: #56b6c2; font-weight: 600; }
    .syn-fn { color: #61afef; font-weight: 500; }
    .syn-number { color: #d19a66; }
    .syn-property { color: #e06c75; }
    .syn-punct { color: #abb2bf; }

    .code-preview {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0 1rem;
      background: transparent;
      border: none;
      color: transparent;
      caret-color: #38bdf8;
      font-family: var(--editor-font-family, 'Fira Code', monospace);
      font-size: var(--editor-font-size, 14px);
      line-height: 1.6;
      resize: none;
      outline: none;
      white-space: pre;
      box-sizing: border-box;
      overflow: auto;
      tab-size: var(--editor-tab-size, 2);
      z-index: 2;
    }

    .code-preview::selection {
      background: rgba(56, 189, 248, 0.25);
      color: transparent;
    }

    .annotations-overlay-panel {
      position: absolute;
      bottom: 12px;
      right: 12px;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
    }

    .annotation-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: var(--radius-md);
      padding: 0.75rem;
      box-shadow: var(--shadow-lg);
    }
    .annotation-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      font-size: 0.75rem;
    }
    .annotation-line { font-weight: 700; color: #f8fafc; }
    .annotation-cat { color: #94a3b8; margin-left: auto; }
    .annotation-msg { font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px; }
    .annotation-sug { font-size: 0.75rem; color: #34d399; }

    .editor-minimap-gutter {
      width: 50px;
      background: #030712;
      border-left: 1px solid #1e293b;
      padding: 10px 4px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .minimap-sim-line {
      height: 2px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 1px;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
    }

    .form-input, .form-select {
      width: 100%;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.45rem 0.75rem;
      font-size: 0.8125rem;
      color: var(--text-primary);
      outline: none;
      box-sizing: border-box;
    }

    .segmented-control {
      display: flex;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 2px;
    }

    .segment-btn {
      flex: 1;
      background: transparent;
      border: none;
      padding: 0.35rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .segment-btn.active {
      background: var(--bg-surface);
      color: var(--text-primary);
      font-weight: 600;
      box-shadow: var(--shadow-xs);
    }

    .score-result-card {
      background: var(--color-primary-light);
      border: 1px solid var(--color-primary-border);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-top: auto;
    }
    .score-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
    .score-badge { font-size: 1.1rem; font-weight: 800; color: var(--color-primary); }
    .score-title { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); }
    .score-summary { font-size: 0.75rem; color: var(--text-secondary); margin: 0; line-height: 1.4; }

    .info-card {
      margin-top: auto;
      background: var(--color-primary-light);
      border: 1px solid var(--color-primary-border);
      border-radius: var(--radius-md);
      padding: 0.85rem;
    }

    .info-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.25rem;
    }

    .info-desc {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .spinner-sm {
      width: 12px;
      height: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class WorkspacePageComponent {
  readonly ws = inject(WorkspaceService);
  readonly editorManager = inject(EditorManagerService);

  showUploadMenu = false;
  showExportMenu = false;
  isDragging = false;
  copied = false;

  readonly providersConfig = AI_PROVIDERS_CONFIG;

  toggleUploadMenu(): void {
    this.showUploadMenu = !this.showUploadMenu;
    this.showExportMenu = false;
  }

  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
    this.showUploadMenu = false;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.ws.handleFileListUpload(input.files);
    }
  }

  onFolderSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.ws.handleFileListUpload(input.files);
    }
  }

  onZipSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.ws.handleFileListUpload(input.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.ws.handleFileListUpload(event.dataTransfer.files);
    }
  }

  onProviderChange(providerId: AIProviderId): void {
    this.ws.setProvider(providerId);
  }

  onSubmitReview(): void {
    this.ws.submitAIReview().subscribe();
  }

  copyCode(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  getLines(content: string): string[] {
    return (content || '').split('\n');
  }

  getLineNumberDisplay(index: number): string {
    const mode = this.editorManager.lineNumbers();
    if (mode === 'relative') {
      return index === 1 ? '0' : String(index - 1);
    }
    if (mode === 'interval') {
      return index % 5 === 0 || index === 1 ? String(index) : '•';
    }
    return String(index);
  }

  getAnnotationForLine(lineNum: number): CodeIssueAnnotation | undefined {
    return this.ws.activeFileAnnotations().find((a) => a.line === lineNum);
  }

  getLanguageSymbol(lang: string): string {
    const l = (lang || '').toLowerCase();
    if (l.includes('typescript') || l === 'ts') return 'TS';
    if (l.includes('javascript') || l === 'js') return 'JS';
    if (l.includes('python') || l === 'py') return 'PY';
    if (l.includes('java')) return 'JV';
    if (l.includes('cpp') || l === 'c++') return 'C++';
    if (l.includes('go')) return 'GO';
    if (l.includes('rust') || l === 'rs') return 'RS';
    if (l.includes('php')) return 'PHP';
    if (l.includes('json')) return '{}';
    if (l.includes('yaml') || l === 'yml') return 'YM';
    if (l.includes('sql')) return 'DB';
    if (l.includes('markdown') || l === 'md') return 'MD';
    return 'CODE';
  }

  getHighlightedCode(code: string, language: string = 'typescript'): string {
    if (!code) return '';

    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const lines = code.split('\n');

    return lines
      .map((line) => {
        if (!line.trim()) return '&nbsp;';

        const trimmed = line.trim();
        // Full line comment
        if (
          trimmed.startsWith('//') ||
          trimmed.startsWith('#') ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*')
        ) {
          return `<span class="syn-comment">${escapeHtml(line)}</span>`;
        }

        let escaped = escapeHtml(line);
        const tokens: string[] = [];

        const saveToken = (html: string) => {
          tokens.push(html);
          return `___TOKEN_${tokens.length - 1}___`;
        };

        // 1. Strings (single, double, backtick quotes)
        escaped = escaped.replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1|`[\s\S]*?`/g, (m) =>
          saveToken(`<span class="syn-string">${m}</span>`)
        );

        // 2. Comments (inline // or #)
        escaped = escaped.replace(/(\/\/|#).*/g, (m) =>
          saveToken(`<span class="syn-comment">${m}</span>`)
        );

        // 3. Decorators (@Injectable, @Component, etc)
        escaped = escaped.replace(/@\w+/g, (m) =>
          saveToken(`<span class="syn-decorator">${m}</span>`)
        );

        // 4. Keywords
        const keywords =
          /\b(export|import|from|class|interface|type|async|await|return|const|let|var|function|if|else|try|catch|throw|new|typeof|instanceof|public|private|protected|readonly|extends|implements|default|case|switch|break|continue|for|while|do|in|of|void|null|undefined|true|false|def|self|struct|enum|fn|pub|use|mod|package|func|select|where|insert|into|update|delete)\b/g;
        escaped = escaped.replace(keywords, (m) =>
          saveToken(`<span class="syn-keyword">${m}</span>`)
        );

        // 5. Types & Built-in Objects
        const types =
          /\b(string|number|boolean|any|unknown|never|Record|Promise|Array|Object|String|Number|Boolean|JSON|Math|Console|Date|Error|RegExp|Set|Map|Injectable|Component|OnInit|Observable|Signal|HttpClient|WorkspaceService|WorkspacePageComponent|Int|Float|DateTime)\b/g;
        escaped = escaped.replace(types, (m) =>
          saveToken(`<span class="syn-type">${m}</span>`)
        );

        // 6. Function calls (foo(...) or bar.baz(...))
        escaped = escaped.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (m) =>
          saveToken(`<span class="syn-fn">${m}</span>`)
        );

        // 7. Numbers
        escaped = escaped.replace(/\b\d+(\.\d+)?\b/g, (m) =>
          saveToken(`<span class="syn-number">${m}</span>`)
        );

        // 8. Properties / keys (e.g. filename:, content:, "key":)
        escaped = escaped.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)/g, (m) =>
          saveToken(`<span class="syn-property">${m}</span>`)
        );

        // 9. Operators & Punctuation ({}, [], (), =>, =, +, -, *, /, :, ;)
        escaped = escaped.replace(/(=&gt;|&lt;|=|:|\{|\}|\(|\)|\[|\]|;|,|\.|\+|-|\*|\/)/g, (m) =>
          saveToken(`<span class="syn-punct">${m}</span>`)
        );

        // Restore saved tokens
        for (let i = tokens.length - 1; i >= 0; i--) {
          escaped = escaped.replace(`___TOKEN_${i}___`, tokens[i]);
        }

        return escaped;
      })
      .join('\n');
  }

  onEditorScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const parent = target.parentElement;
    if (parent) {
      const backdrop = parent.querySelector('.code-highlight-backdrop') as HTMLElement;
      if (backdrop) {
        backdrop.scrollTop = target.scrollTop;
        backdrop.scrollLeft = target.scrollLeft;
      }
    }
  }
}
