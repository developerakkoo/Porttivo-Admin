import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  gridOutline, peopleOutline, navigateOutline, carOutline, cubeOutline, personOutline,
  flashOutline, cardOutline, cashOutline, shieldCheckmarkOutline, barChartOutline,
  documentTextOutline, notificationsOutline, chevronBackOutline, chevronForwardOutline,
  menuOutline, logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Admin } from '../../models/admin.model';

addIcons({
  grid: gridOutline,
  people: peopleOutline,
  navigate: navigateOutline,
  car: carOutline,
  cube: cubeOutline,
  'cube-outline': cubeOutline,
  person: personOutline,
  flash: flashOutline,
  card: cardOutline,
  cash: cashOutline,
  'shield-check': shieldCheckmarkOutline,
  'bar-chart': barChartOutline,
  'document-text': documentTextOutline,
  notifications: notificationsOutline,
  'chevron-back-outline': chevronBackOutline,
  chevronForward: chevronForwardOutline,
  menu: menuOutline,
  'log-out-outline': logOutOutline
});

interface NavItem {
  path: string;
  label: string;
  icon: string;
  permission?: keyof Admin['permissions'];
}

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  sidebarCollapsed = typeof window !== 'undefined' && window.innerWidth < 992;
  admin: Admin | null = null;

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid' },
    { path: '/users', label: 'User Management', icon: 'people', permission: 'canManageUsers' },
    { path: '/trips', label: 'Shipments / Trips', icon: 'navigate', permission: 'canManageTrips' },
    { path: '/vehicles', label: 'Fleet', icon: 'cube', permission: 'canManageVehicles' },
    { path: '/customers', label: 'Customers', icon: 'person' },
    { path: '/fuel', label: 'Fuel', icon: 'flash', permission: 'canManageFuel' },
    { path: '/fuel-cards', label: 'Fuel Cards', icon: 'card' },
    { path: '/settlements', label: 'Settlements', icon: 'cash', permission: 'canManageSettlements' },
    { path: '/fraud', label: 'Fraud Detection', icon: 'shield-check', permission: 'canManageFraud' },
    { path: '/analytics', label: 'Analytics', icon: 'bar-chart', permission: 'canViewReports' },
    { path: '/audit-logs', label: 'Audit Logs', icon: 'document-text' },
    { path: '/notifications', label: 'Notifications', icon: 'notifications' }
  ];

  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {
    this.authService.currentAdmin$.subscribe(a => (this.admin = a));
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  canShowItem(item: NavItem): boolean {
    if (!item.permission) return true;
    const admin = this.authService.getCurrentAdmin();
    if (!admin?.permissions) return true;
    return (admin.permissions as any)[item.permission] !== false;
  }

  logout() {
    this.socketService.disconnect();
    this.authService.logout();
    window.location.href = '/login';
  }
}
