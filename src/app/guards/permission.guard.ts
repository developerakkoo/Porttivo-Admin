import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permission = route.data['permission'] as string;

  if (!permission) return true;

  const admin = authService.getCurrentAdmin();
  if (!admin?.permissions) return true;

  const hasPermission = (admin.permissions as any)[permission];
  if (hasPermission !== false) return true;

  router.navigate(['/dashboard']);
  return false;
};
