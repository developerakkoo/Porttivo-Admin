import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FraudPageRoutingModule } from './fraud-routing.module';
import { FraudPage } from './fraud.page';

@NgModule({
  declarations: [FraudPage],
  imports: [CommonModule, FormsModule, IonicModule, FraudPageRoutingModule],
})
export class FraudPageModule {}
