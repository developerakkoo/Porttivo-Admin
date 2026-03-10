export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermissions;
  userType: 'admin';
  status: 'active' | 'inactive' | 'blocked';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageTrips: boolean;
  canManageVehicles: boolean;
  canManageFuel: boolean;
  canManageSettlements: boolean;
  canViewReports: boolean;
  canManagePumps: boolean;
  canManageFraud: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: Admin;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
