import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { TripsPageRoutingModule } from './trips-routing.module';
import { TripsPage } from './trips.page';
import { TripDetailPage } from './trip-detail/trip-detail.page';

@NgModule({
  declarations: [TripsPage, TripDetailPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TripsPageRoutingModule,
  ],
})
export class TripsPageModule {}
