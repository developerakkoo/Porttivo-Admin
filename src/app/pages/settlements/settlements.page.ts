import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { 
  LoadingController, 
  ToastController, 
  AlertController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.page.html',
  styleUrls: ['./settlements.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon
  ]
})
export class SettlementsPage implements OnInit {
  settlements: any[] = [];
  pendingSettlements: any[] = [];
  loading = false;
  selectedPumpOwner: string = '';
  startDate: string = '';
  endDate: string = '';
  calculation: any = null;

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadSettlements();
    this.loadPendingSettlements();
  }

  async loadSettlements() {
    this.loading = true;
    try {
      const response = await this.apiService.getSettlements().toPromise();
      if (response?.success) {
        // Backend returns { data: { settlements: [], pagination: {} } }
        this.settlements = (response.data as any).settlements || (response.data as any).data || [];
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load settlements', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async loadPendingSettlements() {
    try {
      const response = await this.apiService.getPendingSettlements().toPromise();
      if (response?.success) {
        this.pendingSettlements = response.data.settlements;
      }
    } catch (error) {
      console.error('Error loading pending settlements:', error);
    }
  }

  async calculateSettlement() {
    if (!this.selectedPumpOwner || !this.startDate || !this.endDate) {
      this.showToast('Please fill all fields', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Calculating...' });
    await loading.present();

    try {
      const response = await this.apiService.calculateSettlement({
        pumpOwnerId: this.selectedPumpOwner,
        startDate: this.startDate,
        endDate: this.endDate,
        period: `${new Date(this.startDate).toLocaleDateString()} - ${new Date(this.endDate).toLocaleDateString()}`
      }).toPromise();

      if (response?.success) {
        this.calculation = response.data.calculation;
        this.showToast('Settlement calculated successfully', 'success');
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to calculate settlement', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async processSettlement(id: string) {
    const loading = await this.loadingController.create({ message: 'Processing...' });
    await loading.present();
    try {
      const response = await this.apiService.processSettlement(id).toPromise();
      if (response?.success) {
        this.showToast('Settlement processing initiated', 'success');
        await this.loadSettlements();
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to process settlement', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async completeSettlement(id: string) {
    const alert = await this.alertController.create({
      header: 'Complete Settlement',
      inputs: [
        {
          name: 'utr',
          type: 'text',
          placeholder: 'UTR Number',
          attributes: {
            required: true
          }
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Notes (optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Complete',
          handler: async (data) => {
            if (!data.utr) {
              this.showToast('UTR is required', 'warning');
              return;
            }
            const loading = await this.loadingController.create({ message: 'Completing...' });
            await loading.present();
            try {
              const response = await this.apiService.completeSettlement(id, data).toPromise();
              if (response?.success) {
                this.showToast('Settlement completed successfully', 'success');
                await this.loadSettlements();
              }
            } catch (error: any) {
              this.showToast(error.error?.message || 'Failed to complete settlement', 'danger');
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

  getStatusClass(status: string): string {
    return `status-badge ${status.toLowerCase()}`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value);
  }
}
