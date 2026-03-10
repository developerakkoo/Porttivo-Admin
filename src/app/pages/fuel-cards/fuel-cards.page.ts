import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonList,
  IonBadge
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-fuel-cards',
  templateUrl: './fuel-cards.page.html',
  styleUrls: ['./fuel-cards.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonList,
    IonBadge
  ]
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
      const response = await this.apiService.getFuelCards().toPromise();
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
      const response = await this.apiService.createFuelCard(this.newCard).toPromise();
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
