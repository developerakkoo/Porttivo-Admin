import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { CustomersPageRoutingModule } from './customers-routing.module';
import { CustomersPage } from './customers.page';

@NgModule({
  declarations: [CustomersPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CustomersPageRoutingModule,
  ],
})
export class CustomersPageModule {}
