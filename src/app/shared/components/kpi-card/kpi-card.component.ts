import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: false,
  template: `
    <ion-card class="kpi-card" [class.alert]="alert">
      <ion-card-content>
        <div class="kpi-header">
          <div class="kpi-icon" *ngIf="icon" [class.alert-icon]="alert">
            <ion-icon [name]="icon"></ion-icon>
          </div>
          <div class="kpi-meta">
            <div class="kpi-label">{{ label }}</div>
            <div class="kpi-value">{{ value }}</div>
            <div class="kpi-sublabel" *ngIf="sublabel">{{ sublabel }}</div>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .kpi-card {
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--ion-border-color);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    }
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .kpi-card.alert {
      border-left: 4px solid var(--ion-color-warning);
    }
    .kpi-header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
    }
    .kpi-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--border-radius);
      background: rgba(var(--ion-color-primary-rgb), 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .kpi-icon.alert-icon {
      background: rgba(var(--ion-color-warning-rgb), 0.12);
    }
    .kpi-icon ion-icon {
      font-size: 24px;
      color: var(--ion-color-primary);
    }
    .kpi-icon.alert-icon ion-icon {
      color: var(--ion-color-warning);
    }
    .kpi-meta {
      flex: 1;
      min-width: 0;
    }
    .kpi-label {
      font-size: var(--text-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wide);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-1);
    }
    .kpi-value {
      font-size: 1.75rem;
      font-weight: 700;
      font-family: var(--font-heading);
      color: var(--ion-text-color);
      line-height: 1.2;
    }
    .kpi-sublabel {
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
      margin-top: var(--space-2);
    }
  `],
})
export class KpiCardComponent {
  @Input() value: string | number = '';
  @Input() label = '';
  @Input() sublabel = '';
  @Input() icon = '';
  @Input() alert = false;
}
