import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/dashboard.model';
import { 
  LoadingController, 
  ToastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonMenu,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonSpinner,
    IonButton
  ]
})
export class DashboardPage implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  currentAdmin: any = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.currentAdmin = this.authService.getCurrentAdmin();
    this.loadDashboardStats();
  }

  async loadDashboardStats() {
    this.loading = true;
    try {
      const response = await this.apiService.getDashboardStats().toPromise();
      if (response?.success) {
        this.stats = response.data.dashboard;
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load dashboard stats', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async refresh() {
    await this.loadDashboardStats();
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

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value);
  }
}
