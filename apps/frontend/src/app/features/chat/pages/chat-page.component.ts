import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ChatPageComponent
 * Purpose: Smart Container Page for Real-time AI Assistant Chat Interface.
 * Responsibilities: Conversational feed, prompt suggestions, code block highlighting, streaming response state, and message composer.
 * Dependencies: Angular CommonModule, ChatStore.
 */
@Component({
  selector: 'cdl-chat-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chat-page-container animate-fade-in">
      <header class="chat-header">
        <div class="header-info">
          <div class="agent-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <div>
            <div class="agent-title-row">
              <h2>CodeLens AI Senior Architect</h2>
              <span class="badge badge-success">Online</span>
            </div>
            <p class="agent-sub">Powered by Gemini 1.5 Pro • Context Window: 128k Tokens</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span>Clear Chat</span>
        </button>
      </header>

      <!-- Message History Feed -->
      <div class="chat-feed">
        <div class="message-group assistant-group">
          <div class="msg-avatar">AI</div>
          <div class="msg-content">
            <div class="msg-header">
              <span class="sender-name">CodeLens AI</span>
              <span class="msg-time">10:42 AM</span>
            </div>
            <div class="msg-body">
              Hello Mohammad! I've indexed your workspace project <code>Main Repository</code>. How can I assist you with code optimization, architecture patterns, or security audits today?
            </div>
          </div>
        </div>

        <div class="message-group user-group">
          <div class="msg-content">
            <div class="msg-header">
              <span class="sender-name">You</span>
              <span class="msg-time">10:44 AM</span>
            </div>
            <div class="msg-body">
              Can you check if there are any async performance bottlenecks in my service layer?
            </div>
          </div>
          <div class="msg-avatar user-avatar">MA</div>
        </div>

        <div class="message-group assistant-group">
          <div class="msg-avatar">AI</div>
          <div class="msg-content">
            <div class="msg-header">
              <span class="sender-name">CodeLens AI</span>
              <span class="msg-time">10:44 AM</span>
            </div>
            <div class="msg-body">
              I reviewed <code>main.ts</code> and noticed your HTTP requests could benefit from response mapping and retry strategies. Here is a recommended snippet:
              <div class="code-block">
                <div class="code-block-header">
                  <span>TypeScript :: Recommended Fix</span>
                  <button class="copy-btn">Copy</button>
                </div>
                <pre><code><span class="code-keyword">import</span> {{ '{' }} catchError, retry {{ '}' }} <span class="code-keyword">from</span> <span class="code-string">'rxjs/operators'</span>;

<span class="code-fn">analyzeCode</span>(content: <span class="code-type">string</span>) {{ '{' }}
  <span class="code-keyword">return</span> <span class="code-keyword">this</span>.http.<span class="code-fn">post</span>(<span class="code-string">'/api/reviews'</span>, {{ '{' }} content {{ '}' }}).pipe(
    <span class="code-fn">retry</span>(2),
    <span class="code-fn">catchError</span>(<span class="code-keyword">this</span>.handleError)
  );
{{ '}' }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div class="prompt-suggestions">
        <button class="prompt-chip">⚡ Optimize Async Operations</button>
        <button class="prompt-chip">🛡️ Run Security Scan</button>
        <button class="prompt-chip">📝 Generate Unit Tests</button>
      </div>

      <!-- Message Composer Area -->
      <footer class="composer-container">
        <div class="composer-box">
          <textarea placeholder="Ask CodeLens AI about your codebase, refactoring, or bugs..." class="composer-input" rows="1"></textarea>
          <div class="composer-toolbar">
            <button class="attach-btn" title="Attach file context">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 4 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <button class="send-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              <span>Send Prompt</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .chat-page-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      padding: 1.5rem 1.5rem 1rem;
      box-sizing: border-box;
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      margin-bottom: 1.25rem;
    }
    .header-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .agent-avatar {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: var(--color-primary-light);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-primary-border);
    }
    .agent-title-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .agent-title-row h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .agent-sub {
      margin: 0.15rem 0 0;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .chat-feed {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-right: 0.5rem;
      margin-bottom: 1rem;
    }
    .message-group {
      display: flex;
      gap: 0.85rem;
      max-width: 85%;
    }
    .assistant-group { align-self: flex-start; }
    .user-group { align-self: flex-end; flex-direction: row; }
    
    .msg-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #3b82f6;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .user-avatar {
      background: linear-gradient(135deg, #2563eb, #4f46e5);
    }
    .msg-content {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 0.85rem 1.125rem;
      box-shadow: var(--shadow-xs);
    }
    .user-group .msg-content {
      background: var(--color-primary-light);
      border-color: var(--color-primary-border);
    }
    .msg-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.35rem;
    }
    .sender-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .msg-time {
      font-size: 0.7rem;
      color: var(--text-subtle);
    }
    .msg-body {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.55;
    }
    .msg-body code {
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-primary);
    }
    .code-block {
      margin-top: 0.75rem;
      background: #0f172a;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .code-block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      padding: 0.4rem 0.85rem;
      font-size: 0.725rem;
      color: #94a3b8;
      font-family: var(--font-mono);
    }
    .copy-btn {
      background: transparent;
      border: none;
      color: #60a5fa;
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
    }
    .code-block pre {
      margin: 0;
      padding: 0.85rem;
      color: #e2e8f0;
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }
    .code-keyword { color: #f472b6; font-weight: 600; }
    .code-string { color: #34d399; }
    .code-fn { color: #a78bfa; }
    .code-type { color: #22d3ee; }

    .prompt-suggestions {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .prompt-chip {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      padding: 0.35rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .prompt-chip:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
      border-color: var(--color-primary-border);
    }
    .composer-container {
      margin-top: auto;
    }
    .composer-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 0.75rem 1rem;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.15s ease;
    }
    .composer-box:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }
    .composer-input {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      resize: none;
      font-size: 0.875rem;
      color: var(--text-primary);
      font-family: inherit;
    }
    .composer-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
    }
    .attach-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.25rem;
      border-radius: 4px;
    }
    .attach-btn:hover { color: var(--text-primary); }
    .send-btn {
      background: var(--color-primary);
      color: #ffffff;
      border: none;
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
    }
  `],
})
export class ChatPageComponent {}
