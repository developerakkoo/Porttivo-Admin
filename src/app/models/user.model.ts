export interface Transporter {
  id: string;
  mobile: string;
  name: string;
  email?: string;
  company?: string;
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  hasAccess: boolean;
  hasPinSet: boolean;
  walletBalance: number;
  totalVehicles?: number;
  totalDrivers?: number;
  totalTrips?: number;
  createdAt: string;
}

export interface Driver {
  id: string;
  mobile: string;
  name: string;
  transporterId: string;
  transporter?: {
    id: string;
    name: string;
    company: string;
  };
  status: 'pending' | 'active' | 'inactive' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high';
  language: string;
  walletBalance: number;
  totalTrips?: number;
  activeTrips?: number;
  createdAt: string;
}

export interface PumpOwner {
  id: string;
  mobile: string;
  name: string;
  email?: string;
  pumpName: string;
  location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    city?: string;
    state?: string;
    pincode?: string;
  };
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  walletBalance: number;
  commissionRate: number;
  totalFuelValue?: number;
  totalDriversVisited?: number;
  totalTransporters?: number;
  createdAt: string;
}

export interface PumpStaff {
  id: string;
  mobile: string;
  name: string;
  pumpOwnerId: string;
  pumpOwner?: {
    id: string;
    name: string;
    pumpName: string;
  };
  status: 'active' | 'inactive' | 'blocked' | 'disabled';
  permissions: {
    canProcessFuel: boolean;
    canViewTransactions: boolean;
    canViewSettlements: boolean;
    canManageStaff: boolean;
  };
  totalTransactions?: number;
  createdAt: string;
}

export interface CompanyUser {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  transporterId: string;
  transporter?: {
    id: string;
    name: string;
    company: string;
  };
  hasAccess: boolean;
  status: 'active' | 'inactive';
  permissions: string[];
  hasPinSet: boolean;
  createdAt: string;
}
