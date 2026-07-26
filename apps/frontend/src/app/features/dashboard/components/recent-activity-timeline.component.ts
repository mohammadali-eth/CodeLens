import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityTimelineItem } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-recent-activity-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activity-card card-panel">
      <div class="header">
        <div>
          <h4 class="card-title">Recent Activity Feed</h4>
          <p class="card-subtitle">Real-time audit log of code reviews and AI interactions</p>
        </div>
        <span class="badge badge-neutral text-xs">Live Feed</span>
      </div>

      <div class="timeline" *ngIf="items && items.length > 0; else emptyState">
        <div class="timeline-item" *ngFor="let item of items">
          <div class="bullet-container">
            <div class="timeline-bullet"></div>
          </div>
          <div class="timeline-content">
            <div class="action-row">
              <span class="action-title">{{ item.action }}</span>
              <span class="action-time">{{ item.createdAt | date:'shortTime' }}</span>
            </div>
            <div class="action-details" *ngIf="item.details">{{ item.details }}</div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <p class="empty-title">No recent activities logged yet</p>
          <p class="empty-sub">Activity logs will automatically populate when AI code reviews, chat sessions, and analysis operations are executed.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .activity-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }
    .card-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0.2rem 0 0;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
      position: relative;
      padding-left: 0.25rem;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 11px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--border-subtle);
    }
    .timeline-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      position: relative;
    }
    .bullet-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      z-index: 1;
    }
    .timeline-bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-primary);
      box-shadow: 0 0 0 4px var(--bg-surface);
    }
    .timeline-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
    }
    .action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .action-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .action-details {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .action-time {
      font-size: 0.725rem;
      color: var(--text-subtle);
      font-weight: 500;
    }
    .empty-state {
      padding: 2.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--bg-app);
      border: 1px dashed var(--border-medium);
      border-radius: var(--radius-md);
    }
    .empty-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .empty-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem;
    }
    .empty-sub {
      font-size: 0.775rem;
      color: var(--text-muted);
      margin: 0;
      max-width: 360px;
    }
  `],
})
export class RecentActivityTimelineComponent {
  @Input() items: ActivityTimelineItem[] = [];
}

