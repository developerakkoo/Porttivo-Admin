import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  form = {
    userId: '',
    userType: 'CUSTOMER',
    type: 'info',
    title: '',
    message: '',
    priority: 'medium'
  };

  userTypes = ['TRANSPORTER', 'DRIVER', 'PUMP_OWNER', 'PUMP_STAFF', 'COMPANY_USER', 'CUSTOMER'];
  types = ['info', 'alert', 'reminder', 'announcement'];
  priorities = ['low', 'medium', 'high'];

  sending = false;

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async send() {
    const { userId, userType, type, title, message } = this.form;
    if (!userId?.trim() || !userType || !type || !title?.trim() || !message?.trim()) {
      await this.showToast('Please fill all required fields', 'warning');
      return;
    }

    this.sending = true;
    const loader = await this.loadingController.create({ message: 'Sending...' });
    await loader.present();

    try {
      const response = await firstValueFrom(this.apiService.sendNotification({
        userId: userId.trim(),
        userType,
        type,
        title: title.trim(),
        message: message.trim(),
        priority: this.form.priority
      }));

      if (response?.success) {
        await this.showToast('Notification sent successfully', 'success');
        this.form = { userId: '', userType: 'CUSTOMER', type: 'info', title: '', message: '', priority: 'medium' };
      } else {
        await this.showToast(response?.message || 'Failed to send', 'danger');
      }
    } catch (error: any) {
      await this.showToast(error.error?.message || 'Failed to send notification', 'danger');
    } finally {
      this.sending = false;
      await loader.dismiss();
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
