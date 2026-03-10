import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Transporter, Driver, PumpOwner, PumpStaff, CompanyUser } from '../../models/user.model';
import { 
  LoadingController, 
  ToastController, 
  AlertController, 
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonList,
  IonItem,
  IonBadge,
  IonButton,
  IonIcon,
  IonFooter
} from '@ionic/angular/standalone';
import { UserDetailModalComponent } from './user-detail-modal/user-detail-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonList,
    IonItem,
    IonBadge,
    IonButton,
    IonIcon,
    IonFooter
  ]
})
export class UsersPage implements OnInit {
  selectedTab = 'transporters';
  
  transporters: Transporter[] = [];
  drivers: Driver[] = [];
  pumpOwners: PumpOwner[] = [];
  pumpStaff: PumpStaff[] = [];
  companyUsers: CompanyUser[] = [];

  transportersPagination: any = {};
  driversPagination: any = {};
  pumpOwnersPagination: any = {};
  pumpStaffPagination: any = {};
  companyUsersPagination: any = {};

  filters: any = {
    transporters: { status: '', search: '', page: 1, limit: 20 },
    drivers: { status: '', transporterId: '', page: 1, limit: 20 },
    pumpOwners: { status: '', page: 1, limit: 20 },
    pumpStaff: { pumpOwnerId: '', status: '', page: 1, limit: 20 },
    companyUsers: { transporterId: '', status: '', page: 1, limit: 20 }
  };

  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  segmentChanged(event: any) {
    this.selectedTab = event.detail.value;
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      switch (this.selectedTab) {
        case 'transporters':
          await this.loadTransporters();
          break;
        case 'drivers':
          await this.loadDrivers();
          break;
        case 'pumpOwners':
          await this.loadPumpOwners();
          break;
        case 'pumpStaff':
          await this.loadPumpStaff();
          break;
        case 'companyUsers':
          await this.loadCompanyUsers();
          break;
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load data', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async loadTransporters() {
    const response = await this.apiService.getTransporters(this.filters.transporters).toPromise();
    if (response?.success) {
      // Backend returns { data: { transporters: [], pagination: {} } }
      this.transporters = (response.data as any).transporters || (response.data as any).data || [];
      this.transportersPagination = (response.data as any).pagination || {};
    }
  }

  async loadDrivers() {
    const response = await this.apiService.getDrivers(this.filters.drivers).toPromise();
    if (response?.success) {
      // Backend returns { data: { drivers: [], pagination: {} } }
      this.drivers = (response.data as any).drivers || (response.data as any).data || [];
      this.driversPagination = (response.data as any).pagination || {};
    }
  }

  async loadPumpOwners() {
    const response = await this.apiService.getPumpOwners(this.filters.pumpOwners).toPromise();
    if (response?.success) {
      // Backend returns { data: { pumpOwners: [], pagination: {} } }
      this.pumpOwners = (response.data as any).pumpOwners || (response.data as any).data || [];
      this.pumpOwnersPagination = (response.data as any).pagination || {};
    }
  }

  async loadPumpStaff() {
    const response = await this.apiService.getPumpStaff(this.filters.pumpStaff).toPromise();
    if (response?.success) {
      // Backend returns { data: { staff: [], pagination: {} } }
      this.pumpStaff = (response.data as any).staff || (response.data as any).data || [];
      this.pumpStaffPagination = (response.data as any).pagination || {};
    }
  }

  async loadCompanyUsers() {
    const response = await this.apiService.getCompanyUsers(this.filters.companyUsers).toPromise();
    if (response?.success) {
      // Backend returns { data: { users: [], pagination: {} } }
      this.companyUsers = (response.data as any).users || (response.data as any).data || [];
      this.companyUsersPagination = (response.data as any).pagination || {};
    }
  }

  onFilterChange() {
    this.filters[this.selectedTab].page = 1;
    this.loadData();
  }

  async updateStatus(userId: string, currentStatus: string, userType: string) {
    const alert = await this.alertController.create({
      header: 'Update Status',
      inputs: [
        {
          name: 'status',
          type: 'radio',
          label: 'Active',
          value: 'active',
          checked: currentStatus === 'active'
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Inactive',
          value: 'inactive',
          checked: currentStatus === 'inactive'
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Blocked',
          value: 'blocked',
          checked: currentStatus === 'blocked'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: async (data) => {
            await this.performStatusUpdate(userId, data.status, userType);
          }
        }
      ]
    });

    await alert.present();
  }

  async performStatusUpdate(userId: string, status: string, userType: string) {
    const loading = await this.loadingController.create({ message: 'Updating...' });
    await loading.present();

    try {
      let response;
      switch (userType) {
        case 'transporter':
          response = await this.apiService.updateTransporterStatus(userId, status).toPromise();
          break;
        case 'driver':
          response = await this.apiService.updateDriverStatus(userId, status).toPromise();
          break;
        case 'pumpOwner':
          response = await this.apiService.updatePumpOwnerStatus(userId, status).toPromise();
          break;
      }

      if (response?.success) {
        this.showToast('Status updated successfully', 'success');
        await this.loadData();
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to update status', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async viewDetails(userId: string, userType: string) {
    const modal = await this.modalController.create({
      component: UserDetailModalComponent,
      componentProps: {
        userId,
        userType
      }
    });
    await modal.present();
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

  getStatusClass(status: string): string {
    return `status-badge ${status}`;
  }

  goToPage(page: number) {
    this.filters[this.selectedTab].page = page;
    this.loadData();
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value);
  }
}
