import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
  styleUrls: ['./user-detail-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class UserDetailModalComponent implements OnInit {
  @Input() userId!: string;
  @Input() userType!: string;
  
  user: any = null;
  loading = true;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    await this.loadUserDetails();
  }

  async loadUserDetails() {
    this.loading = true;
    try {
      let response;
      switch (this.userType) {
        case 'transporter':
          response = await this.apiService.getTransporter(this.userId).toPromise();
          if (response?.success) this.user = response.data.transporter;
          break;
        case 'driver':
          response = await this.apiService.getDriver(this.userId).toPromise();
          if (response?.success) this.user = response.data.driver;
          break;
        case 'pumpOwner':
          response = await this.apiService.getPumpOwner(this.userId).toPromise();
          if (response?.success) this.user = response.data.pumpOwner;
          break;
        case 'pumpStaff':
          response = await this.apiService.getPumpStaffMember(this.userId).toPromise();
          if (response?.success) this.user = response.data.staff;
          break;
        case 'companyUser':
          response = await this.apiService.getCompanyUser(this.userId).toPromise();
          if (response?.success) this.user = response.data.user;
          break;
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
