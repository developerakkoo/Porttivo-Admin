import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuditLogsPageRoutingModule } from './audit-logs-routing.module';
import { AuditLogsPage } from './audit-logs.page';

@NgModule({
  declarations: [AuditLogsPage],
  imports: [CommonModule, FormsModule, IonicModule, AuditLogsPageRoutingModule],
})
export class AuditLogsPageModule {}
