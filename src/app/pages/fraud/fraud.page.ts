import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-fraud',
  standalone: false,
  templateUrl: './fraud.page.html',
  styleUrls: ['./fraud.page.scss'],
})
export class FraudPage implements OnInit {
  alerts: any[] = [];
  stats: any = null;
  loading = false;
  filters: any = { resolved: 'false', page: 1, limit: 20 };
  pagination: any = {};

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadFraudAlerts();
    this.loadFraudStats();
  }

  async loadFraudAlerts() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getFraudAlerts(this.filters));
      if (response?.success) {
        // Backend returns { data: [...], pagination: {...} } but type says PaginatedResponse
        // Handle both structures for compatibility
        if (Array.isArray(response.data)) {
          this.alerts = response.data as any;
          this.pagination = (response as any).pagination || {};
        } else {
          this.alerts = (response.data as any).alerts || (response.data as any).data || [];
          this.pagination = (response.data as any).pagination || {};
        }
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load fraud alerts', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async loadFraudStats() {
    try {
      const response = await firstValueFrom(this.apiService.getFraudStats());
      if (response?.success) {
        this.stats = response.data.stats;
      }
    } catch (error) {
      console.error('Error loading fraud stats:', error);
    }
  }

  async resolveAlert(alertId: string) {
    const alert = await this.alertController.create({
      header: 'Resolve Fraud Alert',
      inputs: [
        {
          name: 'isFraud',
          type: 'radio',
          label: 'False Positive',
          value: 'false',
          checked: true
        },
        {
          name: 'isFraud',
          type: 'radio',
          label: 'Confirmed Fraud',
          value: 'true'
        },
        {
          name: 'resolution',
          type: 'textarea',
          placeholder: 'Resolution notes'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Resolve',
          handler: async (data) => {
            const loading = await this.loadingController.create({ message: 'Resolving...' });
            await loading.present();
            try {
              const response = await firstValueFrom(this.apiService.resolveFraudAlert(alertId, {
                isFraud: data.isFraud === 'true',
                resolution: data.resolution || ''
              }));
              if (response?.success) {
                this.showToast('Fraud alert resolved', 'success');
                await this.loadFraudAlerts();
              }
            } catch (error: any) {
              this.showToast(error.error?.message || 'Failed to resolve alert', 'danger');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
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
}
