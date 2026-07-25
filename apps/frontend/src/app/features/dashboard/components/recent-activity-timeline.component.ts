import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityTimelineItem } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-recent-activity-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activity-card">
      <h4 class="card-title">Recent Activity Feed</h4>
      <div class="timeline" *ngIf="items && items.length > 0; else emptyState">
        <div class="timeline-item" *ngFor="let item of items">
          <div class="timeline-bullet"></div>
          <div class="timeline-content">
            <div class="action-title">{{ item.action }}</div>
            <div class="action-details" *ngIf="item.details">{{ item.details }}</div>
            <div class="action-time">{{ item.createdAt | date:'short' }}</div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">No recent activities logged yet.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .activity-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
      backdrop-filter: blur(12px);
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 1rem;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      padding-left: 0.5rem;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 4px;
      bottom: 4px;
      width: 2px;
      background: rgba(255, 255, 255, 0.08);
    }
    .timeline-item {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      position: relative;
    }
    .timeline-bullet {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #6366f1;
      border: 2px solid #0f172a;
      z-index: 1;
      margin-top: 4px;
    }
    .timeline-content {
      display: flex;
      flex-direction: column;
    }
    .action-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    .action-details {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.1rem;
    }
    .action-time {
      font-size: 0.72rem;
      color: #64748b;
      margin-top: 0.2rem;
    }
    .empty-state {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 0.85rem;
    }
  `],
})
export class RecentActivityTimelineComponent {
  @Input() items: ActivityTimelineItem[] = [];
}
