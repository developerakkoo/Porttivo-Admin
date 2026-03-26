import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  activeTab = 'all';
  duplicates: any[] = [];
  customers: any[] = [];
  loading = false;
  customerFilters: any = { page: 1, limit: 20, status: '', search: '' };
  customerPagination: any = {};

  constructor(
    private router: Router,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.onTabChange();
  }

  onTabChange() {
    if (this.activeTab === 'all') {
      this.loadCustomers();
    } else {
      this.loadDuplicates();
    }
  }

  async loadCustomers() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getCustomersList(this.customerFilters));
      if (response?.success) {
        this.customers = (response.data as any).customers || [];
        this.customerPagination = (response.data as any).pagination || {};
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load customers', 'danger');
    } finally {
      this.loading = false;
    }
  }

  goToCustomerPage(page: number) {
    this.customerFilters.page = page;
    this.loadCustomers();
  }

  viewCustomerDetail(customerId: string) {
    this.router.navigate(['/users', 'detail', 'customer', customerId]);
  }

  async toggleCustomerStatus(c: any) {
    const newStatus = c.status === 'blocked' ? 'active' : 'blocked';
    const loading = await this.loadingController.create({ message: 'Updating...' });
    await loading.present();
    try {
      const response = await firstValueFrom(this.apiService.updateCustomerStatus(c.id, newStatus));
      if (response?.success) {
        this.showToast(`Customer ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`, 'success');
        await this.loadCustomers();
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to update', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  formatDate(d: string): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
  }

  async loadDuplicates() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getDuplicateCustomers());
      if (response?.success) {
        this.duplicates = (response.data as any).duplicates || [];
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load duplicate customers', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async mergeCustomers(group: any) {
    const customers = group.customers || [];
    if (customers.length < 2) return;

    const inputs = customers.map((c: any) => ({
      name: 'targetId',
      type: 'radio' as const,
      label: `${c.name || 'N/A'} (${c.mobile || c.email || 'no contact'})`,
      value: c.id
    }));

    const alert = await this.alertController.create({
      header: 'Merge Duplicate Customers',
      message: 'Select which customer to KEEP (target). The others will be merged into it and deleted.',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Merge',
          handler: async (data) => {
            const targetId = data.targetId;
            if (!targetId) {
              this.showToast('Please select a customer to keep', 'warning');
              return false;
            }
            const sourceIds = customers.map((c: any) => c.id).filter((id: string) => id !== targetId);
            const loading = await this.loadingController.create({ message: 'Merging...' });
            await loading.present();
            try {
              for (const sourceId of sourceIds) {
                await firstValueFrom(this.apiService.mergeCustomers(sourceId, targetId));
              }
              this.showToast('Customers merged successfully', 'success');
              await this.loadDuplicates();
            } catch (error: any) {
              this.showToast(error.error?.message || 'Failed to merge customers', 'danger');
            } finally {
              loading.dismiss();
            }
            return true;
          }
        }
      ]
    });
    await alert.present();
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
