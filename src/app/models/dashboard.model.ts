export interface DashboardStats {
  totalTransporters: number;
  activeTransporters: number;
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  activeVehicles: number;
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  pendingPODTrips: number;
  totalFuelTransactions: number;
  totalFuelValue: number;
  todayFuelValue: number;
  totalPumpOwners: number;
  activePumpOwners: number;
  pendingSettlements: number;
  totalSettlements: number;
  fraudAlerts: number;
  pendingFraudAlerts: number;
  expiringDocuments: number;
  period: {
    startDate: string | null;
    endDate: string | null;
  };
}

export interface AnalyticsData {
  type: 'trips' | 'fuel' | 'users' | 'vehicles';
  groupBy: 'day' | 'week' | 'month';
  data: Array<{
    date: string;
    [key: string]: any;
  }>;
  summary: {
    [key: string]: any;
  };
}
