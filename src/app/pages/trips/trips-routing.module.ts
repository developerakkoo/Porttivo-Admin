import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripsPage } from './trips.page';
import { TripDetailPage } from './trip-detail/trip-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TripsPage
  },
  {
    path: ':id',
    component: TripDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsPageRoutingModule {}
