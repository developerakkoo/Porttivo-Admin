import { Component, Input } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  analyticsOutline,
  carOutline,
  folderOpenOutline,
  peopleOutline,
  personOutline,
  storefrontOutline,
} from 'ionicons/icons';

addIcons({
  'analytics-outline': analyticsOutline,
  'car-outline': carOutline,
  'folder-open-outline': folderOpenOutline,
  'people-outline': peopleOutline,
  'person-outline': personOutline,
  'storefront-outline': storefrontOutline,
});

@Component({
  selector: 'app-empty-state',
  standalone: false,
  template: `
    <div class="empty-state">
      <ion-icon *ngIf="icon" [name]="icon" class="empty-icon"></ion-icon>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message" *ngIf="message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--ion-color-medium);
    }
    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.6;
    }
    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--ion-text-color);
      margin: 0 0 8px;
    }
    .empty-message {
      font-size: 0.9375rem;
      margin: 0 0 24px;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() title = 'No data';
  @Input() message = '';
}
