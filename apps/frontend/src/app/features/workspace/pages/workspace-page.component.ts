import {
  Component,
  inject,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WorkspaceService, AIProviderId, AI_PROVIDERS_CONFIG, CodeIssueAnnotation } from '../services/workspace.service';
import { EditorManagerService } from '../../settings/services/editor-manager.service';
import { MonacoEditorComponent } from '../components/monaco-editor/monaco-editor.component';
import { getLanguageDisplayName, getLanguageSymbol } from '../utils/language-detector';

@Component({
  selector: 'cdl-workspace-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MonacoEditorComponent],
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
              <span class="lang-icon-badge" [title]="getLangDisplay(file.name)">
                {{ getLangSymbol(file.name) }}
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

        <!-- Center Column: Monaco Browser IDE Editor -->
        <main class="editor-container">
          <div class="editor-placeholder" *ngIf="ws.activeFile() as file">
            <!-- Tab Bar & Metadata -->
            <div class="editor-header">
              <div class="tab-item active">
                <span class="lang-icon-badge" [title]="getLangDisplay(file.name)">
                  {{ getLangSymbol(file.name) }}
                </span>
                <span>{{ file.name }}</span>
              </div>

              <div class="editor-meta">
                <button class="btn-copy" (click)="copyCode(file.content)">
                  <span>{{ copied ? 'Copied!' : 'Copy Code' }}</span>
                </button>
                <span class="lang-tag">{{ getLangDisplay(file.name) }}</span>
                <span class="encoding-tag">UTF-8</span>
                <span class="size-tag">{{ (file.size / 1024) | number:'1.1-1' }} KB</span>
              </div>
            </div>

            <!-- Monaco Editor Viewport -->
            <div class="code-editor-viewport monaco-viewport">
              <cdl-monaco-editor
                #monacoEditor
                [activeFile]="file"
                [lineNumbers]="editorManager.lineNumbers()"
                [minimapEnabled]="editorManager.minimap()"
                (contentChange)="ws.updateActiveFileContent($event)"
              ></cdl-monaco-editor>

              <!-- Inline Annotations Panel -->
              <div class="annotations-overlay-panel" *ngIf="ws.activeFileAnnotations().length > 0">
                <div 
                  class="annotation-card" 
                  *ngFor="let issue of ws.activeFileAnnotations()"
                  (click)="monacoEditor.revealLine(issue.line)"
                >
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
      padding: 0.6rem 1rem;
      text-align: left;
      font-size: 0.825rem;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.15s ease;
    }
    .upload-menu button:hover {
      background: var(--bg-surface-hover);
    }

    .analysis-progress-banner {
      background: #0f172a;
      border-bottom: 1px solid var(--border-color);
      padding: 0.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .progress-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: var(--color-primary);
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    .status-msg { font-weight: 500; color: var(--text-primary); }
    .pct-val { margin-left: auto; font-weight: 700; color: var(--color-primary); }

    .progress-track {
      height: 4px;
      background: var(--bg-surface-secondary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: var(--color-primary);
      transition: width 0.3s ease;
    }

    .workspace-grid {
      display: grid;
      grid-template-columns: 240px 1fr 300px;
      flex: 1;
      overflow: hidden;
    }

    .sidebar {
      background: var(--bg-surface);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      user-select: none;
    }

    .sidebar-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    .sidebar-section-header h3 {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .file-count {
      font-size: 0.7rem;
      background: var(--bg-surface-secondary);
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
    }

    .explorer-search {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }
    .search-input {
      width: 100%;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
      color: var(--text-primary);
      outline: none;
      box-sizing: border-box;
    }

    .file-list {
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
      overflow-y: auto;
      flex: 1;
    }
    .file-list li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      font-size: 0.8rem;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.15s ease;
      position: relative;
    }
    .file-list li:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .file-list li.active {
      background: var(--bg-surface-active);
      color: var(--color-primary);
      font-weight: 600;
    }
    .lang-icon-badge {
      font-size: 0.75rem;
    }
    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .file-delete-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .file-list li:hover .file-delete-btn {
      opacity: 1;
    }
    .file-delete-btn:hover {
      color: #ef4444;
    }
    .active-dot {
      width: 6px;
      height: 6px;
      background: var(--color-primary);
      border-radius: 50%;
    }
    .empty-files-state {
      padding: 2rem 1rem;
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      background: #0b0f19;
      position: relative;
      overflow: hidden;
    }

    .editor-placeholder {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      border-bottom: 1px solid var(--border-color);
      height: 36px;
      padding-right: 1rem;
    }
    .tab-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1rem;
      height: 100%;
      background: #0b0f19;
      border-right: 1px solid var(--border-color);
      border-top: 2px solid var(--color-primary);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    .editor-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.7rem;
    }
    .btn-copy {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-copy:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }
    .lang-tag, .encoding-tag, .size-tag {
      background: var(--bg-surface-secondary);
      color: var(--text-muted);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-sm);
      font-family: monospace;
      font-weight: 600;
    }

    .monaco-viewport {
      flex: 1;
      position: relative;
      height: calc(100% - 36px);
      width: 100%;
    }

    .annotations-overlay-panel {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      width: 320px;
      max-height: 240px;
      overflow-y: auto;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem;
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(8px);
      z-index: 20;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .annotation-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    .annotation-card:hover {
      border-color: var(--color-primary);
    }
    .annotation-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.7rem;
      margin-bottom: 0.25rem;
    }
    .annotation-line { font-weight: 700; color: var(--text-primary); }
    .annotation-cat { color: var(--text-muted); margin-left: auto; }
    .annotation-msg { font-size: 0.75rem; color: var(--text-primary); line-height: 1.3; }
    .annotation-sug { font-size: 0.7rem; color: var(--color-primary); margin-top: 0.25rem; }

    .context-panel {
      background: var(--bg-surface);
      border-left: 1px solid var(--border-color);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      overflow-y: auto;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-header h3 {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-group label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-input, .form-select {
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.45rem 0.75rem;
      font-size: 0.8rem;
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

  @ViewChild('monacoEditor') monacoEditor?: MonacoEditorComponent;

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
    // Read current content from Monaco model into active file before submission
    if (this.monacoEditor) {
      const currentVal = this.monacoEditor.getCurrentValue();
      if (currentVal) {
        this.ws.updateActiveFileContent(currentVal);
      }
    }
    this.ws.submitAIReview().subscribe();
  }

  copyCode(fallbackText: string): void {
    const codeToCopy = this.monacoEditor?.getCurrentValue() || fallbackText;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  getLangDisplay(filename: string): string {
    return getLanguageDisplayName(filename);
  }

  getLangSymbol(filename: string): string {
    return getLanguageSymbol(filename);
  }
}
