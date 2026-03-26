import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vehicles',
  standalone: false,
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  vehicles: any[] = [];
  expiringDocuments: any[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadExpiringDocuments();
  }

  async loadVehicles() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getVehicles());
      if (response?.success) {
        if (Array.isArray(response.data)) {
          this.vehicles = response.data as any;
        } else {
          this.vehicles =
            (response.data as any).vehicles || (response.data as any).data || [];
        }
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load vehicles', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async loadExpiringDocuments() {
    try {
      const response = await firstValueFrom(this.apiService.getExpiringDocuments());
      if (response?.success && response.data) {
        this.expiringDocuments = response.data.expiringDocuments || [];
      }
    } catch {
      // optional
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
