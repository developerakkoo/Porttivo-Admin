import { Component, OnInit, OnDestroy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { SocketService } from '../../../services/socket.service';
import { environment } from '../../../../environments/environment';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TimelineItem } from '../../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-trip-detail',
  standalone: false,
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
})
export class TripDetailPage implements OnInit, OnDestroy {
  trip: any = null;
  loading = true;
  tripId = '';
  driverLocation: { latitude: number; longitude: number } | null = null;
  private driverLocationSub: { unsubscribe: () => void } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private socketService: SocketService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.tripId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tripId) {
      this.loadTrip();
      this.socketService.joinTrip(this.tripId);
      const events = [
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
      events.forEach(ev =>
        this.socketService.onTripEvent(ev).subscribe((payload: any) => {
          const t = payload?.trip;
          const pid = (t?._id ?? t?.id)?.toString();
          if (pid === this.tripId && t) {
            this.trip = this.trip ? { ...this.trip, ...t } : t;
          } else {
            this.loadTrip();
          }
        })
      );
      this.driverLocationSub = this.socketService.onTripEvent('driver:location:updated').subscribe((payload: any) => {
        const pid = payload?.tripId?.toString();
        if (pid === this.tripId && typeof payload?.latitude === 'number' && typeof payload?.longitude === 'number') {
          this.driverLocation = { latitude: payload.latitude, longitude: payload.longitude };
        }
      });
    }
  }

  ngOnDestroy() {
    this.driverLocationSub?.unsubscribe();
  }

  async loadTrip() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getTrip(this.tripId));
      if (response?.success) {
        this.trip = (response.data as any).trip ?? response.data;
      } else {
        this.showToast('Trip not found', 'danger');
        this.router.navigate(['/trips']);
      }
    } catch (error: any) {
      this.showToast(error.error?.message || 'Failed to load trip', 'danger');
      this.router.navigate(['/trips']);
    } finally {
      this.loading = false;
    }
  }

  async refresh(event: any) {
    await this.loadTrip();
    event?.target?.complete();
  }

  get timelineItems(): TimelineItem[] {
    if (!this.trip?.milestones?.length) return [];
    const labels: Record<string, string> = {
      CONTAINER_PICKED: 'Container Picked',
      REACHED_LOCATION: 'Reached Location',
      LOADING_UNLOADING: 'Loading/Unloading',
      REACHED_DESTINATION: 'Reached Destination',
      TRIP_COMPLETED: 'Trip Completed',
    };
    return this.trip.milestones.map((m: any) => ({
      title: labels[m.milestoneType] || m.milestoneType,
      subtitle: m.backendMeaning,
      date: m.timestamp,
      completed: true,
      photo: m.photo,
    }));
  }

  get pickupAddress(): string {
    return this.trip?.pickupLocation?.address || this.trip?.pickupLocation?.city || '-';
  }

  get dropAddress(): string {
    return this.trip?.dropLocation?.address || this.trip?.dropLocation?.city || '-';
  }

  get podImageUrl(): string {
    const photo = this.trip?.POD?.photo || this.trip?.pod?.photo;
    if (!photo) return '';
    if (photo.startsWith('http')) return photo;
    const base = environment.apiUrl.replace(/\/api\/?$/, '');
    return photo.startsWith('/') ? `${base}${photo}` : `${base}/${photo}`;
  }

  get canCancel(): boolean {
    return ['PLANNED', 'ACTIVE', 'ACCEPTED', 'POD_PENDING'].includes(this.trip?.status);
  }

  get canForceClose(): boolean {
    return this.trip?.status === 'POD_PENDING';
  }

  async doCancel() {
    const alert = await this.alertController.create({
      header: 'Cancel Trip',
      message: 'Are you sure you want to cancel this trip?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingController.create({ message: 'Cancelling...' });
            await loading.present();
            try {
              const response = await firstValueFrom(this.apiService.cancelTrip(this.tripId));
              if (response?.success) {
                this.showToast('Trip cancelled', 'success');
                await this.loadTrip();
              }
            } catch (error: any) {
              this.showToast(error.error?.message || 'Failed to cancel', 'danger');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async doForceClose() {
    const alert = await this.alertController.create({
      header: 'Force Close Trip',
      message: 'Close this trip without POD? This action cannot be undone.',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingController.create({ message: 'Closing...' });
            await loading.present();
            try {
              const response = await firstValueFrom(this.apiService.adminUpdateTripStatus(this.tripId, 'CLOSED_WITHOUT_POD'));
              if (response?.success) {
                this.showToast('Trip closed', 'success');
                await this.loadTrip();
              }
            } catch (error: any) {
              this.showToast(error.error?.message || 'Failed to close', 'danger');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async doReassign() {
    const alert = await this.alertController.create({
      header: 'Reassign Trip',
      message: 'Reassign trip requires transporter, driver, and vehicle selection. Use the full reassign flow.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  formatDate(d: string | Date): string {
    if (!d) return '-';
    return new Date(d).toLocaleString();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
