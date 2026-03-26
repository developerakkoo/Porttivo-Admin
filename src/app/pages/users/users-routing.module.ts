import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersPage } from './users.page';
import { UserDetailPage } from './user-detail/user-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UsersPage
  },
  {
    path: 'detail/:userType/:id',
    component: UserDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
