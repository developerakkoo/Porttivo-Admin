import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';
import { DataTableColumn } from '../../shared/components/data-table/data-table.component';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trips',
  standalone: false,
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage implements OnInit {
  trips: any[] = [];
  loading = false;
  filters: any = {
    status: '',
    transporterId: '',
    driverId: '',
    customerId: '',
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 20,
    sort: 'createdAt',
    sortDir: 'desc'
  };
  pagination: any = {};
  columns: DataTableColumn[] = [
    { key: 'tripId', label: 'Trip ID', sortable: true },
    { key: 'containerNumber', label: 'Container' },
    { key: 'reference', label: 'Reference' },
    { key: 'transporterId.name', label: 'Transporter' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true }
  ];

  rowLinkFn = (row: any) => `/trips/${row.id}`;

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params['transporterId']) this.filters.transporterId = params['transporterId'];
      if (params['driverId']) this.filters.driverId = params['driverId'];
      if (params['customerId']) this.filters.customerId = params['customerId'];
      this.loadTrips();
    });
    this.socketService.connect();
    const tripEvents = [
      'trip:created',
      'trip:started',
      'trip:milestone:updated',
      'trip:completed',
      'trip:pod:pending',
      'trip:pod:uploaded',
      'trip:closed:with-pod',
      'trip:closed:without-pod',
      'trip:cancelled',
      'trip:vehicle:assigned',
      'trip:driver:assigned',
    ];
    tripEvents.forEach((ev) =>
      this.socketService.onTripEvent(ev).subscribe((payload: any) => {
        if (payload?.trip) {
          this.mergeTripUpdate(payload.trip);
        } else {
          this.loadTrips();
        }
      })
    );
  }

  private mergeTripUpdate(updatedTrip: any) {
    const id = updatedTrip?._id ?? updatedTrip?.id;
    if (!id) {
      this.loadTrips();
      return;
    }
    const idx = this.trips.findIndex((t: any) => (t._id ?? t.id) === id);
    if (idx >= 0) {
      this.trips = [...this.trips.slice(0, idx), { ...this.trips[idx], ...updatedTrip }, ...this.trips.slice(idx + 1)];
    } else {
      this.trips = [updatedTrip, ...this.trips];
    }
  }

  onSort(ev: { key: string; dir: 'asc' | 'desc' }) {
    this.filters.sort = ev.key;
    this.filters.sortDir = ev.dir;
    this.filters.page = 1;
    this.loadTrips();
  }

  applySearch() {
    this.filters.page = 1;
    this.loadTrips();
  }

  goToPage(page: number) {
    this.filters.page = page;
    this.loadTrips();
  }

  async loadTrips() {
    this.loading = true;
    try {
      const params: any = { ...this.filters };
      if (params.search && params.search.trim()) {
        const q = params.search.trim();
        delete params.search;
        try {
          const searchRes = await firstValueFrom(this.apiService.searchTrips(q));
          if (searchRes?.success) {
            this.trips = (searchRes.data as any).trips || [];
            this.pagination = {
              page: 1,
              pages: 1,
              total: (searchRes.data as any).count || this.trips.length
            };
            return;
          }
        } catch (_) {}
      }
      const response = await firstValueFrom(this.apiService.getTrips(params));
      if (response?.success) {
        if (Array.isArray(response.data)) {
          this.trips = response.data as any;
          this.pagination = (response as any).pagination || {};
        } else {
          this.trips = (response.data as any).trips || (response.data as any).data || [];
          this.pagination = (response.data as any).pagination || {};
        }
      }
    } catch (error: any) {
      this.toastService.error(error.error?.message || 'Failed to load trips');
    } finally {
      this.loading = false;
    }
  }
}
