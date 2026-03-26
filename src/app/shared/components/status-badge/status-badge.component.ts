import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: false,
  template: `
    <span class="status-badge" [class]="'status-' + statusClass">{{ label || formatStatus(status) }}</span>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: var(--border-radius, 6px);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .status-active, .status-success, .status-completed, .status-closed_with_pod, .status-accepted {
      background: #dcfce7;
      color: #166534;
    }
    .status-blocked, .status-cancelled, .status-error {
      background: #fee2e2;
      color: #b91c1c;
    }
    .status-pending, .status-planned, .status-booked, .status-open {
      background: #fef3c7;
      color: #b45309;
    }
    .status-inactive {
      background: #f1f5f9;
      color: #475569;
    }
    .status-pod_pending {
      background: #ede9fe;
      color: #5b21b6;
    }
    .status-assigned {
      background: #dbeafe;
      color: #1d4ed8;
    }
  `],
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label = '';

  get statusClass(): string {
    return (this.status || '').toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  }

  formatStatus(s: string): string {
    if (!s) return '—';
    return s.replace(/_/g, ' ');
  }
}
