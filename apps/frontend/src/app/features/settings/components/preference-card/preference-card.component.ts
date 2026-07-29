import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PreferenceCardComponent
 * Purpose: Reusable dumb row component for individual setting options, switches, and drop-downs.
 * Responsibilities: Layout alignment, title, description, icon rendering, and projected control slots.
 * Dependencies: Angular CommonModule.
 */
@Component({
  selector: 'app-preference-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preference-row" [class.disabled]="disabled">
      <div class="row-info">
        <div class="row-icon" *ngIf="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ng-container [ngSwitch]="icon">
              <path *ngSwitchCase="'palette'" d="M12 21a9 9 0 1 1 0-18c2 0 3.5 1 3.5 3 0 1.5-1 2.5-1 3.5 0 1.5 1.5 2 3 2h.5A4.5 4.5 0 0 1 21 16c0 2.8-4 5-9 5z"/>
              <path *ngSwitchCase="'type'" d="M4 7V4h16v3M9 20h6M12 4v16"/>
              <path *ngSwitchCase="'code'" d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
              <path *ngSwitchCase="'moon'" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              <path *ngSwitchCase="'sun'" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              <path *ngSwitchCase="'cpu'" d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 9h6v6H9z"/>
              <path *ngSwitchCase="'bell'" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              <path *ngSwitchCase="'lock'" d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z"/>
              <path *ngSwitchCase="'shield'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path *ngSwitchCase="'key'" d="M21 2l-2 2m-1.5 1.5L14 9.5M9.5 14A5.5 5.5 0 1 1 15 8.5L22 15.5V20h-4.5v-2H15.5v-2.5L14 14"/>
              <path *ngSwitchDefault d="M12 2v20m10-10H2"/>
            </ng-container>
          </svg>
        </div>
        <div class="row-text">
          <h4 class="label">{{ label }}</h4>
          <p class="description" *ngIf="description">{{ description }}</p>
        </div>
      </div>

      <div class="row-control">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .preference-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
    }

    .preference-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .preference-row:first-child {
      padding-top: 0;
    }

    .preference-row.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .row-info {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      max-width: 65%;
    }

    .row-icon {
      color: var(--color-primary, #2563eb);
      display: flex;
      align-items: center;
      padding-top: 2px;
    }

    .row-text .label {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-primary, #111827);
    }

    .row-text .description {
      margin: 4px 0 0 0;
      font-size: 0.8125rem;
      color: var(--text-muted, #6b7280);
      line-height: 1.4;
    }

    .row-control {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
  `],
})
export class PreferenceCardComponent {
  @Input() label = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() disabled = false;
}
