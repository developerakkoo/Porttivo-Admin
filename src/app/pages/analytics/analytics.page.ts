import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ChartConfiguration } from 'chart.js';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  analytics: any = null;
  loading = false;
  type = 'trips';
  groupBy = 'day';
  startDate: string = '';
  endDate: string = '';
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = { responsive: true, maintainAspectRatio: false };
  barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, maintainAspectRatio: false };

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
      const response = await firstValueFrom(this.apiService.getAnalytics(
        this.type,
        this.groupBy,
        this.startDate || undefined,
        this.endDate || undefined
      ));
      if (response?.success) {
        this.analytics = response.data.analytics;
        this.buildCharts();
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

  buildCharts() {
    if (!this.analytics?.data?.length) return;
    const labels = this.analytics.data.map((d: any) => d.date);
    if (this.type === 'trips') {
      this.lineChartData = {
        labels,
        datasets: [
          { data: this.analytics.data.map((d: any) => d.count || 0), label: 'Trips', borderColor: '#0E2A47', backgroundColor: 'rgba(14,42,71,0.1)' },
          { data: this.analytics.data.map((d: any) => d.completed || 0), label: 'Completed', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' },
        ],
      };
    } else if (this.type === 'fuel') {
      this.barChartData = {
        labels,
        datasets: [
          { data: this.analytics.data.map((d: any) => d.totalAmount || 0), label: 'Fuel Value (₹)', backgroundColor: '#F97316' },
        ],
      };
    } else if (this.type === 'users') {
      this.lineChartData = {
        labels,
        datasets: [
          { data: this.analytics.data.map((d: any) => d.transporters || 0), label: 'Transporters', borderColor: '#0E2A47' },
          { data: this.analytics.data.map((d: any) => d.drivers || 0), label: 'Drivers', borderColor: '#F97316' },
        ],
      };
    } else if (this.type === 'vehicles') {
      this.lineChartData = {
        labels,
        datasets: [
          { data: this.analytics.data.map((d: any) => d.count || 0), label: 'Vehicles', borderColor: '#0E2A47' },
          { data: this.analytics.data.map((d: any) => d.active || 0), label: 'Active', borderColor: '#22c55e' },
        ],
      };
    }
  }
}
