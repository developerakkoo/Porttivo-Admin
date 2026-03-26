import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FuelCardsPageRoutingModule } from './fuel-cards-routing.module';
import { FuelCardsPage } from './fuel-cards.page';

@NgModule({
  declarations: [FuelCardsPage],
  imports: [CommonModule, FormsModule, IonicModule, FuelCardsPageRoutingModule],
})
export class FuelCardsPageModule {}
