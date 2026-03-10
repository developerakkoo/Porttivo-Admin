import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuelCardsPage } from './fuel-cards.page';

const routes: Routes = [
  {
    path: '',
    component: FuelCardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelCardsPageRoutingModule {}
