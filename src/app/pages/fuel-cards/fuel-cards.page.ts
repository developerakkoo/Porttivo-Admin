import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-fuel-cards',
  standalone: false,
  templateUrl: './fuel-cards.page.html',
  styleUrls: ['./fuel-cards.page.scss'],
})
export class FuelCardsPage implements OnInit {
  cards: any[] = [];
  loading = false;
  showCreateForm = false;
  newCard: any = { cardNumber: '', transporterId: '', balance: 0 };

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadFuelCards();
  }

  async loadFuelCards() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getFuelCards());
      if (response?.success) {
        this.cards = response.data;
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load fuel cards', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async createFuelCard() {
    if (!this.newCard.cardNumber || !this.newCard.transporterId) {
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    const loading = await this.loadingController.create({ message: 'Creating...' });
    await loading.present();

    try {
      const response = await firstValueFrom(this.apiService.createFuelCard(this.newCard));
      if (response?.success) {
        this.showToast('Fuel card created successfully', 'success');
        this.showCreateForm = false;
        this.newCard = { cardNumber: '', transporterId: '', balance: 0 };
        await this.loadFuelCards();
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to create fuel card', 'danger');
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
