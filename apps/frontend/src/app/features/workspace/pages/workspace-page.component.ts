import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService, AIProviderId, AI_PROVIDERS_CONFIG } from '../services/workspace.service';
import { EditorManagerService } from '../../settings/services/editor-manager.service';

/**
 * WorkspacePageComponent
 * Purpose: Production-grade AI Code Review Cloud IDE Workspace.
 * Responsibilities:
 *  - Handles File Explorer (Files, Folders, Drag & Drop, ZIP archives, Search filtering)
 *  - Integrates Monaco/Code Viewport with EditorManagerService preferences (Font, Line Numbers, Minimap, Word Wrap)
 *  - Provides AI Review Settings (Provider selection, Dynamic model list, Analysis depth, Review Title)
 *  - Manages AI static analysis pipeline submission and live progress updates
 * Dependencies: WorkspaceService, EditorManagerService.
 */
@Component({
  selector: 'cdl-workspace-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          <h3>Drop Files, Folders, or ZIP Archives Here</h3>
          <p>Import code directly into your AI Code Review Workspace</p>
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
                <span>📄 Upload Single/Multiple Files</span>
              </button>
              <button (click)="folderInput.click(); showUploadMenu = false">
                <span>📁 Upload Entire Folder</span>
              </button>
              <button (click)="zipInput.click(); showUploadMenu = false">
                <span>📦 Upload ZIP Archive</span>
              </button>
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
              <span>Analyzing Code...</span>
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
              <p>No files match your search filter.</p>
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
                  <span>{{ getLineNumberDisplay(i + 1) }}</span>
                </ng-container>
              </div>

              <textarea
                class="code-preview"
                [ngModel]="file.content"
                (ngModelChange)="ws.updateActiveFileContent($event)"
                spellcheck="false"
              ></textarea>

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
              (ngModelChange)="ws.setProvider($event)"
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

          <!-- Dynamic Info Pre-Check Card -->
          <div class="info-card">
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

    .code-preview {
      flex: 1;
      margin: 0;
      padding: 0 1rem;
      background: transparent;
      border: none;
      color: #f8fafc;
      font-family: var(--editor-font-family, 'Fira Code', monospace);
      font-size: var(--editor-font-size, 14px);
      line-height: 1.6;
      resize: none;
      outline: none;
      tab-size: var(--editor-tab-size, 2);
    }

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
  isDragging = false;
  copied = false;

  readonly providersConfig = AI_PROVIDERS_CONFIG;

  toggleUploadMenu(): void {
    this.showUploadMenu = !this.showUploadMenu;
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
}
