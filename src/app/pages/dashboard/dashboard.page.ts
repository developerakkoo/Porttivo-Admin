import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/dashboard.model';
import { ChartConfiguration } from 'chart.js';
import { addIcons } from 'ionicons';
import { refreshOutline, peopleOutline, carOutline, cubeOutline, navigateOutline, flameOutline, storefrontOutline, cashOutline, warningOutline, documentOutline } from 'ionicons/icons';
import { ToastService } from '../../services/toast.service';

addIcons({
  'refresh-outline': refreshOutline,
  people: peopleOutline,
  car: carOutline,
  cube: cubeOutline,
  map: navigateOutline,
  flame: flameOutline,
  storefront: storefrontOutline,
  cash: cashOutline,
  warning: warningOutline,
  document: documentOutline
});

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  currentAdmin: any = null;
  startDate = '';
  endDate = '';
  recentActivities: any[] = [];
  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12 }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#64748b' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: { font: { size: 11 }, color: '#64748b' }
      }
    }
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.currentAdmin = this.authService.getCurrentAdmin();
    this.loadDashboardStats();
    this.loadRecentActivities();
    this.loadChartData();
  }

  async loadDashboardStats() {
    this.loading = true;
    try {
      const response = await firstValueFrom(
        this.apiService.getDashboardStats(this.startDate || undefined, this.endDate || undefined)
      );
      if (response?.success) {
        this.stats = response.data.dashboard;
      }
    } catch (error: any) {
      this.toastService.error(error.error?.message || 'Failed to load dashboard stats');
    } finally {
      this.loading = false;
    }
  }

  async loadRecentActivities() {
    try {
      const response = await firstValueFrom(this.apiService.getSystemAuditLogs({ limit: 10 }));
      if (response?.success) {
        this.recentActivities = (response.data as any).logs || [];
      }
    } catch (error) {
      console.error('Failed to load recent activities:', error);
    }
  }

  async loadChartData() {
    try {
      const response = await firstValueFrom(
        this.apiService.getAnalytics('trips', 'day', this.startDate || undefined, this.endDate || undefined)
      );
      if (response?.success && (response.data as any).analytics?.data?.length) {
        const data = (response.data as any).analytics.data;
        this.chartData = {
          labels: data.map((d: any) => d.date),
          datasets: [
            {
              data: data.map((d: any) => d.count || 0),
              label: 'Trips',
              borderColor: '#0E2A47',
              backgroundColor: 'rgba(14,42,71,0.08)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              data: data.map((d: any) => d.completed || 0),
              label: 'Completed',
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22,163,74,0.08)',
              fill: true,
              tension: 0.3,
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        };
      }
    } catch (_) {
      this.chartData = { labels: [], datasets: [] };
    }
  }

  applyDateFilter() {
    this.loadDashboardStats();
    this.loadChartData();
  }

  async refresh() {
    this.loading = true;
    await this.loadDashboardStats();
    await this.loadRecentActivities();
    await this.loadChartData();
    this.loading = false;
  }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleString();
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value);
  }
}
