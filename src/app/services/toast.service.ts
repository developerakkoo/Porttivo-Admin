import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastController: ToastController) {}

  async success(message: string, duration = 3000) {
    const t = await this.toastController.create({
      message,
      duration,
      color: 'success',
      position: 'top'
    });
    await t.present();
  }

  async error(message: string, duration = 4000) {
    const t = await this.toastController.create({
      message,
      duration,
      color: 'danger',
      position: 'top'
    });
    await t.present();
  }

  async warning(message: string, duration = 3000) {
    const t = await this.toastController.create({
      message,
      duration,
      color: 'warning',
      position: 'top'
    });
    await t.present();
  }

  async info(message: string, duration = 3000) {
    const t = await this.toastController.create({
      message,
      duration,
      color: 'primary',
      position: 'top'
    });
    await t.present();
  }
}
