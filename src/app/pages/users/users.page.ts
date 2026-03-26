import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Transporter, Driver, PumpOwner, PumpStaff, CompanyUser } from '../../models/user.model';
import { addIcons } from 'ionicons';
import { eyeOutline, settingsOutline } from 'ionicons/icons';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

addIcons({ 'settings-outline': settingsOutline, 'eye-outline': eyeOutline });

type UserTab = 'transporters' | 'drivers' | 'pumpOwners' | 'pumpStaff' | 'companyUsers';

interface ListFilters {
  status: string;
  search: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}

interface TransportersFilters extends ListFilters {}

interface DriversFilters extends ListFilters {
  transporterId: string;
  riskLevel: string;
}

interface PumpOwnersFilters extends ListFilters {}

interface PumpStaffFilters extends ListFilters {
  pumpOwnerId: string;
}

interface CompanyUsersFilters extends ListFilters {
  transporterId: string;
  hasAccess: string;
}

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  selectedTab: UserTab = 'transporters';

  transporters: Transporter[] = [];
  drivers: Driver[] = [];
  pumpOwners: PumpOwner[] = [];
  pumpStaff: PumpStaff[] = [];
  companyUsers: CompanyUser[] = [];

  transportersPagination: Record<string, unknown> = {};
  driversPagination: Record<string, unknown> = {};
  pumpOwnersPagination: Record<string, unknown> = {};
  pumpStaffPagination: Record<string, unknown> = {};
  companyUsersPagination: Record<string, unknown> = {};

  transporterFilterOptions: { id: string; label: string }[] = [];
  pumpOwnerFilterOptions: { id: string; label: string }[] = [];

  filters: {
    transporters: TransportersFilters;
    drivers: DriversFilters;
    pumpOwners: PumpOwnersFilters;
    pumpStaff: PumpStaffFilters;
    companyUsers: CompanyUsersFilters;
  } = {
    transporters: { status: '', search: '', page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    drivers: {
      status: '',
      transporterId: '',
      riskLevel: '',
      search: '',
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    pumpOwners: { status: '', search: '', page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    pumpStaff: {
      pumpOwnerId: '',
      status: '',
      search: '',
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    companyUsers: {
      transporterId: '',
      status: '',
      hasAccess: '',
      search: '',
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  };

  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.loadFilterOptions();
    this.loadData();
  }

  async loadFilterOptions() {
    try {
      const [tRes, pRes] = await Promise.all([
        firstValueFrom(this.apiService.getTransporters({ page: 1, limit: 500, sortBy: 'name', sortOrder: 'asc' })),
        firstValueFrom(this.apiService.getPumpOwners({ page: 1, limit: 500, sortBy: 'name', sortOrder: 'asc' }))
      ]);
      if (tRes?.success) {
        const list = (tRes.data as any)?.transporters || (tRes.data as any)?.data || [];
        this.transporterFilterOptions = list.map((t: Transporter & { id?: string }) => ({
          id: String(t.id),
          label: `${t.company || t.name || ''} (${t.mobile || ''})`
        }));
      }
      if (pRes?.success) {
        const list = (pRes.data as any)?.pumpOwners || (pRes.data as any)?.data || [];
        this.pumpOwnerFilterOptions = list.map((p: PumpOwner & { id?: string }) => ({
          id: String(p.id),
          label: `${p.pumpName || p.name || ''} (${p.mobile || ''})`
        }));
      }
    } catch {
      this.transporterFilterOptions = [];
      this.pumpOwnerFilterOptions = [];
    }
  }

  segmentChanged(event: Event) {
    const tab = (event as CustomEvent<{ value: UserTab }>).detail?.value;
    if (tab) {
      this.selectedTab = tab;
      this.loadData();
    }
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
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      this.showToast(err.error?.message || 'Failed to load data', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async loadTransporters() {
    const response = await firstValueFrom(this.apiService.getTransporters(this.filters.transporters));
    if (response?.success) {
      this.transporters = (response.data as any).transporters || (response.data as any).data || [];
      this.transportersPagination = (response.data as any).pagination || {};
    }
  }

  async loadDrivers() {
    const response = await firstValueFrom(this.apiService.getDrivers(this.filters.drivers));
    if (response?.success) {
      this.drivers = (response.data as any).drivers || (response.data as any).data || [];
      this.driversPagination = (response.data as any).pagination || {};
    }
  }

  async loadPumpOwners() {
    const response = await firstValueFrom(this.apiService.getPumpOwners(this.filters.pumpOwners));
    if (response?.success) {
      this.pumpOwners = (response.data as any).pumpOwners || (response.data as any).data || [];
      this.pumpOwnersPagination = (response.data as any).pagination || {};
    }
  }

  async loadPumpStaff() {
    const response = await firstValueFrom(this.apiService.getPumpStaff(this.filters.pumpStaff));
    if (response?.success) {
      this.pumpStaff = (response.data as any).staff || (response.data as any).data || [];
      this.pumpStaffPagination = (response.data as any).pagination || {};
    }
  }

  async loadCompanyUsers() {
    const response = await firstValueFrom(this.apiService.getCompanyUsers(this.filters.companyUsers));
    if (response?.success) {
      this.companyUsers = (response.data as any).users || (response.data as any).data || [];
      this.companyUsersPagination = (response.data as any).pagination || {};
    }
  }

  onFilterChange() {
    this.filters[this.selectedTab].page = 1;
    this.loadData();
  }

  onSearchInput() {
    this.filters[this.selectedTab].page = 1;
    this.loadData();
  }

  async updateStatus(userId: string, currentStatus: string, userType: string) {
    const inputs = this.radioInputsForUserType(userType, currentStatus);
    const alert = await this.alertController.create({
      header: 'Update status',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: async (data: { status?: string }) => {
            if (data?.status) await this.performStatusUpdate(userId, data.status, userType);
          }
        }
      ]
    });

    await alert.present();
  }

  private radioInputsForUserType(userType: string, currentStatus: string) {
    const opts: { label: string; value: string }[] = [];
    if (userType === 'transporter') {
      opts.push(
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Pending', value: 'pending' }
      );
    } else if (userType === 'driver') {
      opts.push(
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Blocked', value: 'blocked' }
      );
    } else if (userType === 'pumpOwner') {
      opts.push(
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Pending', value: 'pending' }
      );
    } else if (userType === 'companyUser') {
      opts.push(
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Blocked', value: 'blocked' }
      );
    } else if (userType === 'pumpStaff') {
      opts.push(
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Disabled', value: 'disabled' }
      );
    }
    return opts.map((o) => ({
      name: 'status',
      type: 'radio' as const,
      label: o.label,
      value: o.value,
      checked: currentStatus === o.value
    }));
  }

  async performStatusUpdate(userId: string, status: string, userType: string) {
    const loading = await this.loadingController.create({ message: 'Updating...' });
    await loading.present();

    try {
      let response;
      switch (userType) {
        case 'transporter':
          response = await firstValueFrom(this.apiService.updateTransporterStatus(userId, status));
          break;
        case 'driver':
          response = await firstValueFrom(this.apiService.updateDriverStatus(userId, status));
          break;
        case 'pumpOwner':
          response = await firstValueFrom(this.apiService.updatePumpOwnerStatus(userId, status));
          break;
        case 'companyUser':
          response = await firstValueFrom(this.apiService.updateCompanyUserStatus(userId, status));
          break;
        case 'pumpStaff':
          response = await firstValueFrom(this.apiService.updatePumpStaffStatus(userId, status));
          break;
        default:
          return;
      }

      if (response?.success) {
        this.showToast('Status updated successfully', 'success');
        await this.loadData();
      }
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      this.showToast(err.error?.message || 'Failed to update status', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  viewDetails(userId: string, userType: string) {
    this.router.navigate(['/users', 'detail', userType, userId]);
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

  goToPage(page: number) {
    this.filters[this.selectedTab].page = page;
    this.loadData();
  }

  paginationForTab(): Record<string, unknown> {
    switch (this.selectedTab) {
      case 'transporters':
        return this.transportersPagination;
      case 'drivers':
        return this.driversPagination;
      case 'pumpOwners':
        return this.pumpOwnersPagination;
      case 'pumpStaff':
        return this.pumpStaffPagination;
      case 'companyUsers':
        return this.companyUsersPagination;
      default:
        return {};
    }
  }

  pagPage(): number {
    const p = this.paginationForTab();
    const n = p['page'];
    return typeof n === 'number' ? n : Number(n) || 1;
  }

  pagPages(): number {
    const p = this.paginationForTab();
    const n = p['pages'];
    return typeof n === 'number' ? n : Number(n) || 0;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value);
  }
}
