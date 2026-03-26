import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-audit-logs',
  standalone: false,
  templateUrl: './audit-logs.page.html',
  styleUrls: ['./audit-logs.page.scss'],
})
export class AuditLogsPage implements OnInit {
  logs: any[] = [];
  loading = false;
  filters: any = {
    page: 1,
    limit: 20,
    userType: '',
    action: '',
    resource: '',
    startDate: '',
    endDate: '',
    result: ''
  };
  pagination: any = {};

  userTypes = ['TRANSPORTER', 'DRIVER', 'PUMP_OWNER', 'PUMP_STAFF', 'ADMIN', 'SYSTEM', 'CUSTOMER', 'COMPANY_USER'];
  actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REFRESH', 'CANCEL', 'START', 'COMPLETE', 'POD_UPLOAD', 'POD_APPROVE'];
  resources = ['TRIP', 'USER', 'VEHICLE', 'DRIVER', 'TRANSPORTER', 'AUTH', 'FUEL', 'SETTLEMENT', 'ADMIN'];
  results = ['SUCCESS', 'FAILURE', 'ERROR'];

  constructor(
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadLogs();
  }

  async loadLogs() {
    this.loading = true;
    try {
      const params: any = {
        page: this.filters.page,
        limit: this.filters.limit
      };
      if (this.filters.userType) params.userType = this.filters.userType;
      if (this.filters.action) params.action = this.filters.action;
      if (this.filters.resource) params.resource = this.filters.resource;
      if (this.filters.startDate) params.startDate = this.filters.startDate;
      if (this.filters.endDate) params.endDate = this.filters.endDate;
      if (this.filters.result) params.result = this.filters.result;

      const response = await firstValueFrom(this.apiService.getSystemAuditLogs(params));
      if (response?.success) {
        this.logs = (response.data as any).logs || [];
        this.pagination = (response.data as any).pagination || {};
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load audit logs', 'danger');
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.filters.page = 1;
    this.loadLogs();
  }

  refresh() {
    this.loadLogs();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination.pages) {
      this.filters.page = page;
      this.loadLogs();
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString();
  }

  getResultClass(result: string): string {
    return `result-badge ${(result || '').toLowerCase()}`;
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
