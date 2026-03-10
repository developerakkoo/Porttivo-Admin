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
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon
  ]
})
export class TripsPage implements OnInit {
  trips: any[] = [];
  loading = false;
  filters: any = { status: '', transporterId: '', page: 1, limit: 20 };
  pagination: any = {};

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadTrips();
  }

  async loadTrips() {
    this.loading = true;
    try {
      const response = await this.apiService.getTrips(this.filters).toPromise();
      if (response?.success) {
        // Backend returns { data: [...], pagination: {...} } but type says PaginatedResponse
        // Handle both structures for compatibility
        if (Array.isArray(response.data)) {
          this.trips = response.data as any;
          this.pagination = (response as any).pagination || {};
        } else {
          this.trips = (response.data as any).trips || (response.data as any).data || [];
          this.pagination = (response.data as any).pagination || {};
        }
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load trips', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async cancelTrip(tripId: string) {
    const loading = await this.loadingController.create({ message: 'Cancelling...' });
    await loading.present();
    try {
      const response = await this.apiService.cancelTrip(tripId).toPromise();
      if (response?.success) {
        this.showToast('Trip cancelled successfully', 'success');
        await this.loadTrips();
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to cancel trip', 'danger');
    } finally {
      loading.dismiss();
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
