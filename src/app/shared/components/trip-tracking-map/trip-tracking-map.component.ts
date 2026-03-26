import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { loadGoogleMapsScript } from '../../../services/google-maps-loader.service';

interface GoogleMapsApi {
  maps: {
    Map: new (el: HTMLElement, opts: unknown) => {
      setCenter: (latLng: unknown) => void;
      fitBounds: (bounds: unknown) => void;
    };
    LatLng: new (lat: number, lng: number) => unknown;
    LatLngBounds: new (sw?: unknown, ne?: unknown) => { extend: (latLng: unknown) => void };
    Marker: new (opts: { map: unknown; position: unknown; title?: string }) => {
      setMap: (map: unknown) => void;
      setPosition: (pos: unknown) => void;
    };
    MapTypeId: { ROADMAP: string };
    event?: { clearInstanceListeners?: (obj: unknown) => void };
  };
}

function getGoogleMaps(): GoogleMapsApi | undefined {
  return (typeof window !== 'undefined' && (window as unknown as { google?: GoogleMapsApi }).google) || undefined;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-trip-tracking-map',
  standalone: false,
  templateUrl: './trip-tracking-map.component.html',
  styleUrls: ['./trip-tracking-map.component.scss'],
})
export class TripTrackingMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() pickupLocation: MapLocation | null = null;
  @Input() dropLocation: MapLocation | null = null;
  @Input() driverLocation: MapLocation | null = null;
  @Input() showDriverMarker = true;
  @Input() height = '220px';

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;

  private map: InstanceType<GoogleMapsApi['maps']['Map']> | null = null;
  private pickupMarker: InstanceType<GoogleMapsApi['maps']['Marker']> | null = null;
  private dropMarker: InstanceType<GoogleMapsApi['maps']['Marker']> | null = null;
  private driverMarker: InstanceType<GoogleMapsApi['maps']['Marker']> | null = null;
  private initialized = false;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && this.map) {
      if (changes['pickupLocation'] || changes['dropLocation'] || changes['driverLocation']) {
        this.updateMarkers();
        this.fitBounds();
      }
    }
  }

  ngOnDestroy(): void {
    const g = getGoogleMaps();
    if (this.map && g?.maps?.event?.clearInstanceListeners) {
      g.maps.event!.clearInstanceListeners!(this.map);
    }
    this.map = null;
    this.pickupMarker = null;
    this.dropMarker = null;
    this.driverMarker = null;
  }

  private async initMap(): Promise<void> {
    try {
      await loadGoogleMapsScript();
      const g = getGoogleMaps();
      if (!g?.maps?.Map || !this.mapContainer?.nativeElement) {
        return;
      }

      const center = this.getInitialCenter();
      this.map = new g.maps.Map(this.mapContainer.nativeElement, {
        center: { lat: center.lat, lng: center.lng },
        zoom: 12,
        mapTypeId: g.maps.MapTypeId.ROADMAP,
      });
      this.initialized = true;
      this.updateMarkers();
      this.fitBounds();
    } catch {
      // Map load failed
    }
  }

  private getInitialCenter(): { lat: number; lng: number } {
    if (this.driverLocation) {
      return { lat: this.driverLocation.latitude, lng: this.driverLocation.longitude };
    }
    if (this.pickupLocation) {
      return { lat: this.pickupLocation.latitude, lng: this.pickupLocation.longitude };
    }
    if (this.dropLocation) {
      return { lat: this.dropLocation.latitude, lng: this.dropLocation.longitude };
    }
    return { lat: 19.076, lng: 72.8777 };
  }

  private updateMarkers(): void {
    const g = getGoogleMaps();
    if (!g?.maps || !this.map) return;

    const Maps = g.maps;
    const LatLng = Maps.LatLng;
    const Marker = Maps.Marker;

    if (this.pickupLocation) {
      const pos = new LatLng(this.pickupLocation.latitude, this.pickupLocation.longitude);
      if (!this.pickupMarker) {
        this.pickupMarker = new Marker({ map: this.map, position: pos, title: 'Pickup' });
      } else {
        this.pickupMarker.setPosition(pos);
      }
    } else if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }

    if (this.dropLocation) {
      const pos = new LatLng(this.dropLocation.latitude, this.dropLocation.longitude);
      if (!this.dropMarker) {
        this.dropMarker = new Marker({ map: this.map, position: pos, title: 'Drop' });
      } else {
        this.dropMarker.setPosition(pos);
      }
    } else if (this.dropMarker) {
      this.dropMarker.setMap(null);
      this.dropMarker = null;
    }

    if (this.showDriverMarker && this.driverLocation) {
      const pos = new LatLng(this.driverLocation.latitude, this.driverLocation.longitude);
      if (!this.driverMarker) {
        this.driverMarker = new Marker({ map: this.map, position: pos, title: 'Driver' });
      } else {
        this.driverMarker.setPosition(pos);
      }
    } else if (this.driverMarker) {
      this.driverMarker.setMap(null);
      this.driverMarker = null;
    }
  }

  private fitBounds(): void {
    if (!this.map) return;

    const points: Array<{ lat: number; lng: number }> = [];
    if (this.pickupLocation) {
      points.push({ lat: this.pickupLocation.latitude, lng: this.pickupLocation.longitude });
    }
    if (this.dropLocation) {
      points.push({ lat: this.dropLocation.latitude, lng: this.dropLocation.longitude });
    }
    if (this.driverLocation) {
      points.push({ lat: this.driverLocation.latitude, lng: this.driverLocation.longitude });
    }

    if (points.length === 0) return;

    const g = getGoogleMaps();
    if (!g?.maps?.LatLngBounds) return;

    const LatLng = g.maps.LatLng;
    const LatLngBounds = g.maps.LatLngBounds;

    if (points.length === 1) {
      this.map.setCenter(new LatLng(points[0].lat, points[0].lng));
      return;
    }

    const bounds = new LatLngBounds() as { extend: (p: unknown) => void };
    for (const p of points) {
      bounds.extend(new LatLng(p.lat, p.lng));
    }
    this.map.fitBounds(bounds as unknown);
  }
}
