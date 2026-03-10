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
  IonBadge,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.page.html',
  styleUrls: ['./fuel.page.scss'],
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
    IonBadge,
    IonIcon
  ]
})
export class FuelPage implements OnInit {
  transactions: any[] = [];
  loading = false;
  filters: any = { status: '', page: 1, limit: 20 };
  pagination: any = {};

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    this.loading = true;
    try {
      const response = await this.apiService.getFuelTransactions(this.filters).toPromise();
      if (response?.success) {
        // Backend returns { data: [...], pagination: {...} } but type says PaginatedResponse
        // Handle both structures for compatibility
        if (Array.isArray(response.data)) {
          this.transactions = response.data as any;
          this.pagination = (response as any).pagination || {};
        } else {
          this.transactions = (response.data as any).transactions || (response.data as any).data || [];
          this.pagination = (response.data as any).pagination || {};
        }
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load transactions', 'danger');
    } finally {
      this.loading = false;
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
