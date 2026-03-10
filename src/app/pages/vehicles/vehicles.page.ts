import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
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
    IonIcon
  ]
})
export class VehiclesPage implements OnInit {
  vehicles: any[] = [];
  expiringDocuments: any[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadExpiringDocuments();
  }

  async loadVehicles() {
    this.loading = true;
    try {
      const response = await this.apiService.getVehicles().toPromise();
      if (response?.success) {
        // Backend returns { data: { vehicles: [], pagination: {} } }
        this.vehicles = (response.data as any).vehicles || (response.data as any).data || [];
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load vehicles', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async loadExpiringDocuments() {
    try {
      const response = await this.apiService.getExpiringDocuments(30).toPromise();
      if (response?.success) {
        this.expiringDocuments = response.data.expiringDocuments;
      }
    } catch (error) {
      console.error('Error loading expiring documents:', error);
    }
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
