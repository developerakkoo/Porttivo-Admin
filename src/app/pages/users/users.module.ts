import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';
import { UserDetailPage } from './user-detail/user-detail.page';

@NgModule({
  declarations: [UsersPage, UserDetailPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    UsersPageRoutingModule,
  ],
})
export class UsersPageModule {}
