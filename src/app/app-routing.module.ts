import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule) },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canManageUsers' }
      },
      {
        path: 'trips',
        loadChildren: () => import('./pages/trips/trips.module').then(m => m.TripsPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canManageTrips' }
      },
      {
        path: 'vehicles',
        loadChildren: () => import('./pages/vehicles/vehicles.module').then(m => m.VehiclesPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canManageVehicles' }
      },
      {
        path: 'fuel',
        loadChildren: () => import('./pages/fuel/fuel.module').then(m => m.FuelPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canManageFuel' }
      },
      {
        path: 'settlements',
        loadChildren: () => import('./pages/settlements/settlements.module').then(m => m.SettlementsPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canManageSettlements' }
      },
      {
        path: 'fraud',
        loadChildren: () => import('./pages/fraud/fraud.module').then(m => m.FraudPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canManageFraud' }
      },
      { path: 'fuel-cards', loadChildren: () => import('./pages/fuel-cards/fuel-cards.module').then(m => m.FuelCardsPageModule) },
      {
        path: 'analytics',
        loadChildren: () => import('./pages/analytics/analytics.module').then(m => m.AnalyticsPageModule),
        canActivate: [permissionGuard],
        data: { permission: 'canViewReports' }
      },
      { path: 'customers', loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersPageModule) },
      { path: 'audit-logs', loadChildren: () => import('./pages/audit-logs/audit-logs.module').then(m => m.AuditLogsPageModule) },
      { path: 'notifications', loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule) }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
