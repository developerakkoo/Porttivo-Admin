import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips',
    loadChildren: () => import('./pages/trips/trips.module').then(m => m.TripsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./pages/vehicles/vehicles.module').then(m => m.VehiclesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fuel',
    loadChildren: () => import('./pages/fuel/fuel.module').then(m => m.FuelPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settlements',
    loadChildren: () => import('./pages/settlements/settlements.module').then(m => m.SettlementsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fraud',
    loadChildren: () => import('./pages/fraud/fraud.module').then(m => m.FraudPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fuel-cards',
    loadChildren: () => import('./pages/fuel-cards/fuel-cards.module').then(m => m.FuelCardsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    loadChildren: () => import('./pages/analytics/analytics.module').then(m => m.AnalyticsPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
