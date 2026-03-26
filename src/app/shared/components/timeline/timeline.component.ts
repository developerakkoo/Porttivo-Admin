import { Component, Input } from '@angular/core';

export interface TimelineItem {
  title: string;
  subtitle?: string;
  date?: Date | string;
  completed?: boolean;
  photo?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: false,
  template: `
    <div class="timeline">
      <div *ngFor="let item of items; let i = index" class="timeline-item" [class.completed]="item.completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-title">{{ item.title }}</div>
          <div class="timeline-subtitle" *ngIf="item.subtitle">{{ item.subtitle }}</div>
          <div class="timeline-date" *ngIf="item.date">{{ formatDate(item.date) }}</div>
          <img *ngIf="item.photo" [src]="item.photo" class="timeline-photo" alt="Milestone" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
      padding-left: 24px;
      border-left: 2px solid var(--ion-border-color);
      margin-left: 8px;
    }
    .timeline-item {
      position: relative;
      padding-bottom: 20px;
    }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-marker {
      position: absolute;
      left: -29px;
      top: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--ion-color-medium);
      border: 2px solid var(--ion-background-color);
    }
    .timeline-item.completed .timeline-marker {
      background: var(--ion-color-success);
    }
    .timeline-content { margin-left: 8px; }
    .timeline-title {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--ion-text-color);
    }
    .timeline-subtitle {
      font-size: 0.8rem;
      color: var(--ion-color-medium);
      margin-top: 2px;
    }
    .timeline-date {
      font-size: 0.75rem;
      color: var(--ion-color-medium);
      margin-top: 4px;
    }
    .timeline-photo {
      max-width: 120px;
      max-height: 90px;
      border-radius: var(--border-radius, 8px);
      margin-top: 8px;
      object-fit: cover;
    }
  `],
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];

  formatDate(d: Date | string): string {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleString();
  }
}
