import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FraudPage } from './fraud.page';

const routes: Routes = [
  {
    path: '',
    component: FraudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FraudPageRoutingModule {}
