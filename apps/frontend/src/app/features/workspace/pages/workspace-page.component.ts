import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * WorkspacePageComponent
 * Purpose: Smart Container Page for Code Review Cloud IDE Workspace.
 * Responsibilities: Hosts Monaco Editor, File Tree Sidebar, Toolbar, and Review Settings.
 * Dependencies: Angular CommonModule, WorkspaceStore, Monaco Editor.
 */
@Component({
  selector: 'cdl-workspace-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-page-container animate-fade-in">
      <header class="workspace-header">
        <div class="header-left">
          <h2>Code Review Workspace</h2>
          <span class="badge badge-primary">Cloud IDE</span>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Upload Files</span>
          </button>
          <button class="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Submit AI Review</span>
          </button>
        </div>
      </header>

      <div class="workspace-grid">
        <!-- Left Sidebar: File Explorer -->
        <aside class="sidebar">
          <div class="sidebar-section-header">
            <h3>File Explorer</h3>
            <span class="file-count">3 Files</span>
          </div>
          <ul class="file-list">
            <li class="active">
              <svg class="file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>main.ts</span>
              <span class="active-dot"></span>
            </li>
            <li>
              <svg class="file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>app.service.ts</span>
            </li>
            <li>
              <svg class="file-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>review.controller.ts</span>
            </li>
          </ul>
        </aside>

        <!-- Main Workspace Code Editor Area -->
        <main class="editor-container">
          <div class="editor-placeholder">
            <div class="editor-header">
              <div class="tab-item active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>main.ts</span>
              </div>
              <div class="editor-meta">
                <span class="lang-tag">TypeScript</span>
                <span class="encoding-tag">UTF-8</span>
              </div>
            </div>

            <div class="code-editor-viewport">
              <div class="line-numbers">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
              </div>
              <pre class="code-preview"><code><span class="code-comment">// CodeLens AI Code Review Workspace</span>
<span class="code-keyword">import</span> {{ '{' }} Injectable {{ '}' }} <span class="code-keyword">from</span> <span class="code-string">'&#64;angular/core'</span>;

&#64;<span class="code-decorator">Injectable</span>({{ '{' }} providedIn: <span class="code-string">'root'</span> {{ '}' }})
<span class="code-keyword">export class</span> <span class="code-class">CodeReviewService</span> {{ '{' }}
  <span class="code-keyword">async</span> <span class="code-fn">analyzeCode</span>(content: <span class="code-type">string</span>): <span class="code-type">Promise&lt;any&gt;</span> {{ '{' }}
    <span class="code-keyword">return await</span> <span class="code-fn">fetch</span>(<span class="code-string">'/api/reviews'</span>, {{ '{' }} method: <span class="code-string">'POST'</span> {{ '}' }});
  {{ '}' }}
{{ '}' }}</code></pre>
            </div>
          </div>
        </main>

        <!-- Right Sidebar: AI Review Settings Panel -->
        <aside class="context-panel">
          <div class="panel-header">
            <h3>AI Review Settings</h3>
            <span class="badge badge-primary">Config</span>
          </div>

          <div class="form-group">
            <label>Review Title</label>
            <input type="text" value="Feature Refactoring Review" class="form-input" />
          </div>

          <div class="form-group">
            <label>AI Provider & Model</label>
            <select class="form-select">
              <option>Google Gemini Flash</option>
              <option>OpenAI GPT-4o</option>
              <option>Anthropic Claude 3.5 Sonnet</option>
            </select>
          </div>

          <div class="form-group">
            <label>Analysis Depth</label>
            <div class="segmented-control">
              <button class="segment-btn active">Standard</button>
              <button class="segment-btn">Deep Audit</button>
            </div>
          </div>

          <div class="info-card">
            <div class="info-title">✨ AI Insights Pre-check</div>
            <p class="info-desc">Selected model will analyze syntax, type safety, memory leaks, and performance complexity.</p>
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
    }
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
    .header-actions {
      display: flex;
      gap: 0.65rem;
    }
    .workspace-grid {
      display: grid;
      grid-template-columns: 240px 1fr 300px;
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
      margin-bottom: 1rem;
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
    .file-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
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
    .active-dot {
      margin-left: auto;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-primary);
    }
    .editor-container {
      background: var(--bg-app);
      padding: 1rem;
      overflow: auto;
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
      gap: 0.75rem;
      font-size: 0.7rem;
      color: #94a3b8;
    }
    .lang-tag {
      color: #60a5fa;
      font-weight: 600;
    }
    .code-editor-viewport {
      display: flex;
      flex: 1;
      padding: 1rem 0;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 0.875rem;
      line-height: 1.6;
    }
    .line-numbers {
      display: flex;
      flex-direction: column;
      padding: 0 0.85rem 0 1rem;
      color: #475569;
      user-select: none;
      text-align: right;
    }
    .code-preview {
      margin: 0;
      padding-right: 1rem;
      color: #e2e8f0;
      white-space: pre;
    }
    .code-comment { color: #64748b; font-style: italic; }
    .code-keyword { color: #f472b6; font-weight: 600; }
    .code-string { color: #34d399; }
    .code-decorator { color: #fbbf24; }
    .code-class { color: #60a5fa; font-weight: 600; }
    .code-fn { color: #a78bfa; }
    .code-type { color: #22d3ee; }

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
  `],
})
export class WorkspacePageComponent {}

