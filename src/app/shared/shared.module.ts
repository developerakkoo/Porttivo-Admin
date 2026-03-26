import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { TripTrackingMapComponent } from './components/trip-tracking-map/trip-tracking-map.component';

@NgModule({
  declarations: [
    StatusBadgeComponent,
    KpiCardComponent,
    TimelineComponent,
    EmptyStateComponent,
    SkeletonLoaderComponent,
    DataTableComponent,
    TripTrackingMapComponent,
  ],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [
    StatusBadgeComponent,
    KpiCardComponent,
    TimelineComponent,
    EmptyStateComponent,
    SkeletonLoaderComponent,
    DataTableComponent,
    TripTrackingMapComponent,
  ],
})
export class SharedModule {}
