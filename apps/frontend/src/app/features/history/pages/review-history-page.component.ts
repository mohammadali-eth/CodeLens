import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ReviewHistoryPageComponent
 * Purpose: Smart Container Page for Searching & Browsing Code Review History Logs.
 * Responsibilities: High-density data table, pagination, search filter, status badges, and action dropdowns.
 * Dependencies: Angular CommonModule, HistoryStore.
 */
@Component({
  selector: 'cdl-review-history-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history-page-container animate-fade-in">
      <header class="history-header">
        <div>
          <h1>Review History & Audit Logs</h1>
          <p class="subtitle">Complete archive of automated code reviews and AI diagnostic reports</p>
        </div>
        <button class="btn btn-secondary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Export Audit Log</span>
        </button>
      </header>

      <!-- Search and Filter Bar -->
      <div class="filter-bar card-panel">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Filter reviews by title, repository, or author..." class="filter-input" />
        </div>
        <div class="select-filters">
          <select class="form-select select-sm">
            <option>All Statuses</option>
            <option>Passed</option>
            <option>Warnings</option>
            <option>Critical</option>
          </select>
          <select class="form-select select-sm">
            <option>All Providers</option>
            <option>Google Gemini</option>
            <option>OpenAI GPT-4o</option>
          </select>
        </div>
      </div>

      <!-- Data Table Card Panel -->
      <div class="table-card card-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>REVIEW DETAILS</th>
              <th>REPOSITORY</th>
              <th>QUALITY SCORE</th>
              <th>AI MODEL</th>
              <th>DATE & TIME</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="review-title-box">
                  <span class="review-name">Feature Refactoring Review</span>
                  <span class="review-id">#REV-9402</span>
                </div>
              </td>
              <td>
                <div class="repo-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                  <span>main-repo :: main</span>
                </div>
              </td>
              <td>
                <span class="score-badge pass">92 / 100</span>
              </td>
              <td>
                <span class="model-tag">Gemini Flash</span>
              </td>
              <td>
                <span class="timestamp">Today, 10:44 AM</span>
              </td>
              <td class="text-right">
                <button class="btn btn-secondary btn-xs">View Report</button>
              </td>
            </tr>

            <tr>
              <td>
                <div class="review-title-box">
                  <span class="review-name">API Authentication Endpoint Audit</span>
                  <span class="review-id">#REV-9398</span>
                </div>
              </td>
              <td>
                <div class="repo-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  </svg>
                  <span>backend-api :: auth-v2</span>
                </div>
              </td>
              <td>
                <span class="score-badge pass">95 / 100</span>
              </td>
              <td>
                <span class="model-tag">GPT-4o</span>
              </td>
              <td>
                <span class="timestamp">Yesterday, 4:15 PM</span>
              </td>
              <td class="text-right">
                <button class="btn btn-secondary btn-xs">View Report</button>
              </td>
            </tr>

            <tr>
              <td>
                <div class="review-title-box">
                  <span class="review-name">Database Aggregation Query Indexing</span>
                  <span class="review-id">#REV-9351</span>
                </div>
              </td>
              <td>
                <div class="repo-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                  <span>analytics-pipeline :: dev</span>
                </div>
              </td>
              <td>
                <span class="score-badge warn">78 / 100</span>
              </td>
              <td>
                <span class="model-tag">Claude 3.5</span>
              </td>
              <td>
                <span class="timestamp">Jul 24, 2026</span>
              </td>
              <td class="text-right">
                <button class="btn btn-secondary btn-xs">View Report</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table Footer & Pagination -->
        <div class="table-footer">
          <span class="pagination-info">Showing 1-3 of 48 reviews</span>
          <div class="pagination-actions">
            <button class="btn btn-secondary btn-xs" disabled>Previous</button>
            <button class="btn btn-secondary btn-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-page-container {
      padding: 1.75rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.5rem;
    }
    .history-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 0.25rem 0 0;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.125rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      margin-bottom: 1.25rem;
      box-shadow: var(--shadow-sm);
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex: 1;
      max-width: 440px;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.4rem 0.75rem;
    }
    .search-box svg { color: var(--text-muted); }
    .filter-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.85rem;
      color: var(--text-primary);
      width: 100%;
    }
    .select-filters {
      display: flex;
      gap: 0.65rem;
    }
    .select-sm {
      padding: 0.35rem 0.65rem;
      font-size: 0.8rem;
    }
    .table-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th {
      background: var(--bg-surface-secondary);
      color: var(--text-muted);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }
    .data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
      font-size: 0.85rem;
    }
    .data-table tr:hover td {
      background: var(--bg-app);
    }
    .review-title-box {
      display: flex;
      flex-direction: column;
    }
    .review-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    .review-id {
      font-size: 0.725rem;
      color: var(--text-subtle);
      font-family: var(--font-mono);
      margin-top: 0.1rem;
    }
    .repo-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-md);
      font-size: 0.775rem;
      color: var(--text-secondary);
      font-family: var(--font-mono);
    }
    .score-badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-full);
      font-size: 0.775rem;
      font-weight: 700;
    }
    .score-badge.pass { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .score-badge.warn { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

    .model-tag {
      font-size: 0.775rem;
      color: var(--color-primary);
      font-weight: 600;
    }
    .timestamp {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    .btn-xs {
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
    }
    .text-right { text-align: right; }
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1.25rem;
      background: var(--bg-surface-secondary);
      border-top: 1px solid var(--border-color);
    }
    .pagination-info {
      font-size: 0.775rem;
      color: var(--text-muted);
    }
    .pagination-actions {
      display: flex;
      gap: 0.5rem;
    }
  `],
})
export class ReviewHistoryPageComponent {}
