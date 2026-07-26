import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon" [style.background-color]="iconBg">
        <span class="icon">{{ icon }}</span>
      </div>
      <div class="stat-content">
        <span class="stat-label">{{ label }}</span>
        <h3 class="stat-value">{{ value }}</h3>
        <p class="stat-subtext" *ngIf="subtext">{{ subtext }}</p>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.125rem;
      padding: 1.25rem 1.35rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--border-medium);
    }
    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      font-size: 1.35rem;
      flex-shrink: 0;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
    .stat-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .stat-value {
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0.15rem 0 0;
      letter-spacing: -0.02em;
    }
    .stat-subtext {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 0.15rem 0 0;
    }
  `],
})
export class StatCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() icon = '📊';
  @Input() iconBg = '#eff6ff';
  @Input() subtext?: string;
}

