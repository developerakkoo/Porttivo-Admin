import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { 
  LoadingController, 
  ToastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class AnalyticsPage implements OnInit {
  analytics: any = null;
  loading = false;
  type = 'trips';
  groupBy = 'day';
  startDate: string = '';
  endDate: string = '';

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  async loadAnalytics() {
    this.loading = true;
    try {
      const response = await this.apiService.getAnalytics(
        this.type,
        this.groupBy,
        this.startDate || undefined,
        this.endDate || undefined
      ).toPromise();
      if (response?.success) {
        this.analytics = response.data.analytics;
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load analytics', 'danger');
    } finally {
      this.loading = false;
    }
  }

  onTypeChange() {
    this.loadAnalytics();
  }

  onGroupByChange() {
    this.loadAnalytics();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  getSummaryKeys(summary: any): string[] {
    return Object.keys(summary);
  }

  getDataKeys(item: any): string[] {
    return Object.keys(item).filter(key => key !== 'date');
  }

  formatValue(value: any): string {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-IN').format(value);
    }
    return String(value);
  }
}
