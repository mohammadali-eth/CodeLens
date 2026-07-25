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
      gap: 1.25rem;
      padding: 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      border-color: rgba(99, 102, 241, 0.4);
    }
    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 10px;
      font-size: 1.5rem;
    }
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 500;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0.15rem 0 0;
    }
    .stat-subtext {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0.1rem 0 0;
    }
  `],
})
export class StatCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() icon = '📊';
  @Input() iconBg = 'rgba(99, 102, 241, 0.15)';
  @Input() subtext?: string;
}
