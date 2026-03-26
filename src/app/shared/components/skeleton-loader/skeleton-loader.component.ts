import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: false,
  template: `
    <div class="skeleton-wrapper" [class.full-width]="fullWidth">
      <div *ngFor="let _ of rowArray" class="skeleton-row">
        <div
          *ngFor="let w of widths"
          class="skeleton-line"
          [style.width]="w"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      padding: 16px;
    }
    .skeleton-wrapper.full-width {
      width: 100%;
    }
    .skeleton-row {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      align-items: center;
    }
    .skeleton-row:last-child {
      margin-bottom: 0;
    }
    .skeleton-line {
      height: 16px;
      background: linear-gradient(
        90deg,
        var(--ion-color-light) 25%,
        rgba(var(--ion-color-light-rgb), 0.5) 50%,
        var(--ion-color-light) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() rows = 5;
  @Input() widths: string[] = ['40%', '30%', '20%', '10%'];
  @Input() fullWidth = false;

  get rowArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}
