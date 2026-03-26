import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cubeOutline,
  documentTextOutline,
  openOutline,
  walletOutline,
} from 'ionicons/icons';

addIcons({
  'arrow-back-outline': arrowBackOutline,
  'cube-outline': cubeOutline,
  'document-text-outline': documentTextOutline,
  'open-outline': openOutline,
  'wallet-outline': walletOutline,
});

/** Maps Angular route param to AuditLog.userType (uppercase). */
function routeUserTypeToAuditEnum(userType: string): string | null {
  const m: Record<string, string> = {
    transporter: 'TRANSPORTER',
    driver: 'DRIVER',
    pumpOwner: 'PUMP_OWNER',
    pumpStaff: 'PUMP_STAFF',
    companyUser: 'COMPANY_USER',
    customer: 'CUSTOMER',
  };
  return m[userType] ?? null;
}

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userType = '';
  userId = '';
  user: any = null;
  timeline: any[] = [];
  loading = true;
  timelineLoading = false;

  activeTrips: any[] = [];
  recentTrips: any[] = [];
  activeTripsTotal = 0;
  recentTripsTotal = 0;
  tripsLoading = false;

  auditLogs: any[] = [];
  auditPagination: { page: number; pages: number; total: number; limit: number } = {
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  };
  auditLoading = false;

  fuelTransactions: any[] = [];
  fuelPagination: { page: number; pages: number; total: number; limit: number } = {
    page: 1,
    pages: 1,
    total: 0,
    limit: 15,
  };
  fuelLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.userType = this.route.snapshot.paramMap.get('userType') || '';
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadUser();
    if (!this.user) return;

    if (this.userType === 'driver') {
      await this.loadTimeline();
    }

    await Promise.all([this.loadTripsSections(), this.loadAuditLogs(1), this.loadFuelSection()]);
  }

  async loadUser() {
    this.loading = true;
    try {
      let response: any;
      switch (this.userType) {
        case 'transporter':
          response = await firstValueFrom(this.apiService.getTransporter(this.userId));
          if (response?.success) this.user = response.data.transporter;
          break;
        case 'driver':
          response = await firstValueFrom(this.apiService.getDriver(this.userId));
          if (response?.success) this.user = response.data.driver;
          break;
        case 'pumpOwner':
          response = await firstValueFrom(this.apiService.getPumpOwner(this.userId));
          if (response?.success) this.user = response.data.pumpOwner;
          break;
        case 'pumpStaff':
          response = await firstValueFrom(this.apiService.getPumpStaffMember(this.userId));
          if (response?.success) this.user = response.data.staff;
          break;
        case 'companyUser':
          response = await firstValueFrom(this.apiService.getCompanyUser(this.userId));
          if (response?.success) this.user = response.data.user;
          break;
        case 'customer':
          response = await firstValueFrom(this.apiService.getCustomer(this.userId));
          if (response?.success) this.user = response.data.customer;
          break;
        default:
          this.showToast('Invalid user type', 'danger');
          this.goBack();
          return;
      }
    } catch {
      this.showToast('Failed to load user', 'danger');
      this.goBack();
    } finally {
      this.loading = false;
    }
  }

  async loadTimeline() {
    this.timelineLoading = true;
    try {
      const response = await firstValueFrom(this.apiService.getDriverTimeline(this.userId));
      if (response?.success) {
        this.timeline = (response.data as any).timeline || [];
      }
    } catch {
      this.timeline = [];
    } finally {
      this.timelineLoading = false;
    }
  }

  private tripRowsFromResponse(response: any): any[] {
    const d = response?.data;
    if (Array.isArray(d)) return d;
    return d?.trips || d?.data || [];
  }

  private parsePagination(response: any): { page: number; pages: number; total: number; limit: number } {
    const p = response?.pagination || (response as any)?.data?.pagination || {};
    return {
      page: Number(p.page) || 1,
      pages: Number(p.pages) || 1,
      total: Number(p.total) || 0,
      limit: Number(p.limit) || 20,
    };
  }

  /** Trips for transporter, driver, customer, or company user (via transporter). */
  async loadTripsSections() {
    const base: Record<string, string | number> = { page: 1, limit: 15 };
    const tid = this.getTransporterIdForTripFilter();
    const did = this.userType === 'driver' ? this.resolveEntityId() : '';
    const cid = this.userType === 'customer' ? this.resolveEntityId() : '';

    if (!tid && !did && !cid) {
      return;
    }

    if (tid) base['transporterId'] = tid;
    if (did) base['driverId'] = did;
    if (cid) base['customerId'] = cid;

    this.tripsLoading = true;
    try {
      const [activeRes, recentRes] = await Promise.all([
        firstValueFrom(this.apiService.getTrips({ ...base, status: 'ACTIVE', limit: 25, page: 1 })),
        firstValueFrom(this.apiService.getTrips({ ...base, limit: 10, page: 1 })),
      ]);
      this.activeTrips = this.tripRowsFromResponse(activeRes);
      this.recentTrips = this.tripRowsFromResponse(recentRes);
      this.activeTripsTotal = this.parsePagination(activeRes).total;
      this.recentTripsTotal = this.parsePagination(recentRes).total;
    } catch {
      this.activeTrips = [];
      this.recentTrips = [];
    } finally {
      this.tripsLoading = false;
    }
  }

  private resolveEntityId(): string {
    return String(this.user?.id ?? this.user?._id ?? this.userId);
  }

  /** Transporter id for trip list: direct transporter or company user's org. */
  private getTransporterIdForTripFilter(): string {
    if (this.userType === 'transporter') {
      return this.resolveEntityId();
    }
    if (this.userType === 'companyUser') {
      const t = this.user?.transporterId;
      if (!t) return '';
      if (typeof t === 'object') return String((t as any)._id ?? (t as any).id ?? '');
      return String(t);
    }
    return '';
  }

  showTripsSection(): boolean {
    return (
      this.userType === 'transporter' ||
      this.userType === 'driver' ||
      this.userType === 'customer' ||
      this.userType === 'companyUser'
    );
  }

  async loadAuditLogs(page: number) {
    const auditUserType = routeUserTypeToAuditEnum(this.userType);
    if (!auditUserType) {
      this.auditLogs = [];
      return;
    }
    this.auditLoading = true;
    try {
      const response = await firstValueFrom(
        this.apiService.getSystemAuditLogs({
          userId: this.userId,
          userType: auditUserType,
          page,
          limit: this.auditPagination.limit,
        })
      );
      if (response?.success) {
        const data = response.data as { logs?: any[]; pagination?: any };
        this.auditLogs = data?.logs || [];
        const p = data?.pagination;
        this.auditPagination = {
          page: p?.page ?? page,
          pages: p?.pages ?? 1,
          total: p?.total ?? 0,
          limit: p?.limit ?? this.auditPagination.limit,
        };
      }
    } catch {
      this.auditLogs = [];
    } finally {
      this.auditLoading = false;
    }
  }

  async goAuditPage(delta: number) {
    const next = this.auditPagination.page + delta;
    if (next < 1 || next > this.auditPagination.pages) return;
    await this.loadAuditLogs(next);
  }

  async loadFuelSection(page = 1) {
    let pumpOwnerId: string | null = null;
    let driverId: string | null = null;

    if (this.userType === 'pumpOwner') {
      pumpOwnerId = this.resolveEntityId();
    } else if (this.userType === 'pumpStaff') {
      const po = this.user?.pumpOwnerId;
      pumpOwnerId = po ? (typeof po === 'object' ? String((po as any)._id ?? (po as any).id) : String(po)) : null;
    } else if (this.userType === 'driver') {
      driverId = this.resolveEntityId();
    }

    if (!pumpOwnerId && !driverId) {
      return;
    }

    this.fuelLoading = true;
    try {
      const filters: Record<string, string | number> = { page, limit: this.fuelPagination.limit };
      if (pumpOwnerId) filters['pumpOwnerId'] = pumpOwnerId;
      if (driverId) filters['driverId'] = driverId;

      const response = await firstValueFrom(this.apiService.getFuelTransactions(filters));
      if (response?.success) {
        const data: any = response.data;
        this.fuelTransactions = Array.isArray(data) ? data : data?.transactions || data?.data || [];
        this.fuelPagination = this.parsePagination(response);
      }
    } catch {
      this.fuelTransactions = [];
    } finally {
      this.fuelLoading = false;
    }
  }

  async goFuelPage(delta: number) {
    const next = this.fuelPagination.page + delta;
    if (next < 1 || next > this.fuelPagination.pages) return;
    await this.loadFuelSection(next);
  }

  showFuelSection(): boolean {
    return this.userType === 'pumpOwner' || this.userType === 'pumpStaff' || this.userType === 'driver';
  }

  showAuditSection(): boolean {
    return routeUserTypeToAuditEnum(this.userType) != null;
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  viewTripsForTransporter() {
    if (!this.user?.id && !this.user?._id) return;
    const id = this.resolveEntityId();
    this.router.navigate(['/trips'], { queryParams: { transporterId: id } });
  }

  viewTripsForDriver() {
    const id = this.resolveEntityId();
    this.router.navigate(['/trips'], { queryParams: { driverId: id } });
  }

  viewTripsForCustomer() {
    const id = this.resolveEntityId();
    this.router.navigate(['/trips'], { queryParams: { customerId: id } });
  }

  openTripDetail(trip: any) {
    const id = trip?.id ?? trip?._id;
    if (!id) return;
    this.router.navigate(['/trips', id]);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value ?? 0);
  }

  formatDate(d: string | Date | undefined): string {
    if (!d) return '—';
    return new Date(d).toLocaleString();
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

  async openStatusUpdate() {
    if (!this.user) return;

    const options = this.statusOptionsForType();
    if (!options.length) return;

    const inputs = options.map((opt) => ({
      name: 'status',
      type: 'radio' as const,
      label: opt.label,
      value: opt.value,
      checked: this.user.status === opt.value,
    }));

    const alert = await this.alertController.create({
      header: 'Update status',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: async (data: any) => {
            if (!data?.status) return false;
            await this.applyStatus(data.status);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private statusOptionsForType(): { label: string; value: string }[] {
    switch (this.userType) {
      case 'transporter':
        return [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Blocked', value: 'blocked' },
          { label: 'Pending', value: 'pending' },
        ];
      case 'driver':
        return [
          { label: 'Pending', value: 'pending' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Blocked', value: 'blocked' },
        ];
      case 'pumpOwner':
        return [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Blocked', value: 'blocked' },
          { label: 'Pending', value: 'pending' },
        ];
      case 'companyUser':
        return [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Blocked', value: 'blocked' },
        ];
      case 'pumpStaff':
        return [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Blocked', value: 'blocked' },
          { label: 'Disabled', value: 'disabled' },
        ];
      case 'customer':
        return [
          { label: 'Active', value: 'active' },
          { label: 'Blocked', value: 'blocked' },
        ];
      default:
        return [];
    }
  }

  private async applyStatus(status: string) {
    const loading = await this.loadingController.create({ message: 'Updating...' });
    await loading.present();
    try {
      let response: any;
      switch (this.userType) {
        case 'transporter':
          response = await firstValueFrom(this.apiService.updateTransporterStatus(this.userId, status));
          break;
        case 'driver':
          response = await firstValueFrom(this.apiService.updateDriverStatus(this.userId, status));
          break;
        case 'pumpOwner':
          response = await firstValueFrom(this.apiService.updatePumpOwnerStatus(this.userId, status));
          break;
        case 'companyUser':
          response = await firstValueFrom(this.apiService.updateCompanyUserStatus(this.userId, status));
          break;
        case 'pumpStaff':
          response = await firstValueFrom(this.apiService.updatePumpStaffStatus(this.userId, status));
          break;
        case 'customer':
          response = await firstValueFrom(this.apiService.updateCustomerStatus(this.userId, status));
          break;
        default:
          return;
      }
      if (response?.success) {
        this.showToast('Status updated', 'success');
        await this.loadUser();
        await Promise.all([
          this.loadTripsSections(),
          this.loadAuditLogs(1),
          this.loadFuelSection(1),
        ]);
        if (this.userType === 'driver') {
          await this.loadTimeline();
        }
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Update failed', 'danger');
    } finally {
      loading.dismiss();
    }
  }
}
