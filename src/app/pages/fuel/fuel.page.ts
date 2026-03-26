import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-fuel',
  standalone: false,
  templateUrl: './fuel.page.html',
  styleUrls: ['./fuel.page.scss'],
})
export class FuelPage implements OnInit {
  transactions: any[] = [];
  loading = false;
  filters: any = { status: '', page: 1, limit: 20 };
  pagination: any = {};

  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getFuelTransactions(this.filters));
      if (response?.success) {
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
      position: 'top',
    });
    await toast.present();
  }
}
