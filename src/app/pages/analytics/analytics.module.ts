import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsPageRoutingModule } from './analytics-routing.module';
import { AnalyticsPage } from './analytics.page';

@NgModule({
  declarations: [AnalyticsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseChartDirective,
    AnalyticsPageRoutingModule,
  ],
})
export class AnalyticsPageModule {}
