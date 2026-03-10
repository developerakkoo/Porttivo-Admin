import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse, PaginatedResponse } from '../models/admin.model';
import { DashboardStats, AnalyticsData } from '../models/dashboard.model';
import { Transporter, Driver, PumpOwner, PumpStaff, CompanyUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Dashboard
  getDashboardStats(startDate?: string, endDate?: string): Observable<ApiResponse<{ dashboard: DashboardStats }>> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<ApiResponse<{ dashboard: DashboardStats }>>(
      `${this.apiUrl}/admin/dashboard/stats`,
      { headers: this.getHeaders(), params }
    );
  }

  getAnalytics(type: string = 'trips', groupBy: string = 'day', startDate?: string, endDate?: string): Observable<ApiResponse<{ analytics: AnalyticsData }>> {
    let params = new HttpParams().set('type', type).set('groupBy', groupBy);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<ApiResponse<{ analytics: AnalyticsData }>>(
      `${this.apiUrl}/admin/analytics`,
      { headers: this.getHeaders(), params }
    );
  }

  // Admin Profile
  getProfile(): Observable<ApiResponse<{ admin: any }>> {
    return this.http.get<ApiResponse<{ admin: any }>>(
      `${this.apiUrl}/admins/profile`,
      { headers: this.getHeaders() }
    );
  }

  updateProfile(data: { username?: string; email?: string }): Observable<ApiResponse<{ admin: any }>> {
    return this.http.put<ApiResponse<{ admin: any }>>(
      `${this.apiUrl}/admins/profile`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Transporters
  getTransporters(filters?: any): Observable<ApiResponse<PaginatedResponse<Transporter>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<Transporter>>>(
      `${this.apiUrl}/admin/transporters`,
      { headers: this.getHeaders(), params }
    );
  }

  getTransporter(id: string): Observable<ApiResponse<{ transporter: Transporter }>> {
    return this.http.get<ApiResponse<{ transporter: Transporter }>>(
      `${this.apiUrl}/admin/transporters/${id}`,
      { headers: this.getHeaders() }
    );
  }

  updateTransporterStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/admin/transporters/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  // Drivers
  getDrivers(filters?: any): Observable<ApiResponse<PaginatedResponse<Driver>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<Driver>>>(
      `${this.apiUrl}/admin/drivers`,
      { headers: this.getHeaders(), params }
    );
  }

  getDriver(id: string): Observable<ApiResponse<{ driver: Driver }>> {
    return this.http.get<ApiResponse<{ driver: Driver }>>(
      `${this.apiUrl}/admin/drivers/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getDriverTimeline(id: string, startDate?: string, endDate?: string): Observable<ApiResponse<{ timeline: any[] }>> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<ApiResponse<{ timeline: any[] }>>(
      `${this.apiUrl}/admin/drivers/${id}/timeline`,
      { headers: this.getHeaders(), params }
    );
  }

  updateDriverStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/admin/drivers/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  // Pump Owners
  getPumpOwners(filters?: any): Observable<ApiResponse<PaginatedResponse<PumpOwner>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<PumpOwner>>>(
      `${this.apiUrl}/admin/pump-owners`,
      { headers: this.getHeaders(), params }
    );
  }

  getPumpOwner(id: string): Observable<ApiResponse<{ pumpOwner: PumpOwner }>> {
    return this.http.get<ApiResponse<{ pumpOwner: PumpOwner }>>(
      `${this.apiUrl}/admin/pump-owners/${id}`,
      { headers: this.getHeaders() }
    );
  }

  updatePumpOwnerStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/admin/pump-owners/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  // Pump Staff
  getPumpStaff(filters?: any): Observable<ApiResponse<PaginatedResponse<PumpStaff>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<PumpStaff>>>(
      `${this.apiUrl}/admin/pump-staff`,
      { headers: this.getHeaders(), params }
    );
  }

  getPumpStaffMember(id: string): Observable<ApiResponse<{ staff: PumpStaff }>> {
    return this.http.get<ApiResponse<{ staff: PumpStaff }>>(
      `${this.apiUrl}/admin/pump-staff/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Company Users
  getCompanyUsers(filters?: any): Observable<ApiResponse<PaginatedResponse<CompanyUser>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<CompanyUser>>>(
      `${this.apiUrl}/admin/company-users`,
      { headers: this.getHeaders(), params }
    );
  }

  getCompanyUser(id: string): Observable<ApiResponse<{ user: CompanyUser }>> {
    return this.http.get<ApiResponse<{ user: CompanyUser }>>(
      `${this.apiUrl}/admin/company-users/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Trips
  getTrips(filters?: any): Observable<ApiResponse<PaginatedResponse<any>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.apiUrl}/trips`,
      { headers: this.getHeaders(), params }
    );
  }

  getTrip(id: string): Observable<ApiResponse<{ trip: any }>> {
    return this.http.get<ApiResponse<{ trip: any }>>(
      `${this.apiUrl}/trips/${id}`,
      { headers: this.getHeaders() }
    );
  }

  cancelTrip(id: string, reason?: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/trips/${id}/cancel`,
      { reason },
      { headers: this.getHeaders() }
    );
  }

  searchTrips(query: string): Observable<ApiResponse<{ trips: any[]; count: number }>> {
    return this.http.get<ApiResponse<{ trips: any[]; count: number }>>(
      `${this.apiUrl}/trips/search`,
      { headers: this.getHeaders(), params: new HttpParams().set('q', query) }
    );
  }

  getActiveTrips(transporterId?: string): Observable<ApiResponse<{ trips: any[]; count: number }>> {
    let params = new HttpParams();
    if (transporterId) params = params.set('transporterId', transporterId);
    return this.http.get<ApiResponse<{ trips: any[]; count: number }>>(
      `${this.apiUrl}/trips/active`,
      { headers: this.getHeaders(), params }
    );
  }

  // Vehicles
  getVehicles(filters?: any): Observable<ApiResponse<PaginatedResponse<any>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.apiUrl}/vehicles`,
      { headers: this.getHeaders(), params }
    );
  }

  getVehicle(id: string): Observable<ApiResponse<{ vehicle: any }>> {
    return this.http.get<ApiResponse<{ vehicle: any }>>(
      `${this.apiUrl}/vehicles/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getExpiringDocuments(days: number = 30, documentType?: string): Observable<ApiResponse<{ expiringDocuments: any[]; count: number }>> {
    let params = new HttpParams().set('days', days.toString());
    if (documentType) params = params.set('documentType', documentType);
    return this.http.get<ApiResponse<{ expiringDocuments: any[]; count: number }>>(
      `${this.apiUrl}/vehicles/documents/expiring`,
      { headers: this.getHeaders(), params }
    );
  }

  // Fuel Transactions
  getFuelTransactions(filters?: any): Observable<ApiResponse<PaginatedResponse<any>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.apiUrl}/fuel/transactions`,
      { headers: this.getHeaders(), params }
    );
  }

  getFuelTransaction(id: string): Observable<ApiResponse<{ transaction: any }>> {
    return this.http.get<ApiResponse<{ transaction: any }>>(
      `${this.apiUrl}/fuel/transactions/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Fuel Cards
  getFuelCards(filters?: any): Observable<ApiResponse<any[]>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/fuel-cards`,
      { headers: this.getHeaders(), params }
    );
  }

  createFuelCard(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/fuel-cards`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getFuelCard(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/fuel-cards/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getFuelCardTransactions(id: string, filters?: any): Observable<ApiResponse<PaginatedResponse<any>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.apiUrl}/fuel-cards/${id}/transactions`,
      { headers: this.getHeaders(), params }
    );
  }

  // Settlements
  getSettlements(filters?: any): Observable<ApiResponse<PaginatedResponse<any>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.apiUrl}/settlements`,
      { headers: this.getHeaders(), params }
    );
  }

  getSettlement(id: string): Observable<ApiResponse<{ settlement: any }>> {
    return this.http.get<ApiResponse<{ settlement: any }>>(
      `${this.apiUrl}/settlements/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getPendingSettlements(): Observable<ApiResponse<{ settlements: any[] }>> {
    return this.http.get<ApiResponse<{ settlements: any[] }>>(
      `${this.apiUrl}/settlements/pending`,
      { headers: this.getHeaders() }
    );
  }

  calculateSettlement(data: any): Observable<ApiResponse<{ calculation: any }>> {
    return this.http.post<ApiResponse<{ calculation: any }>>(
      `${this.apiUrl}/settlements/calculate`,
      data,
      { headers: this.getHeaders() }
    );
  }

  processSettlement(id: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/settlements/${id}/process`,
      {},
      { headers: this.getHeaders() }
    );
  }

  completeSettlement(id: string, data: { utr: string; notes?: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/settlements/${id}/complete`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // Fraud Alerts
  getFraudAlerts(filters?: any): Observable<ApiResponse<PaginatedResponse<any>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.apiUrl}/fuel/fraud-alerts`,
      { headers: this.getHeaders(), params }
    );
  }

  getFraudAlert(id: string): Observable<ApiResponse<{ transaction: any }>> {
    return this.http.get<ApiResponse<{ transaction: any }>>(
      `${this.apiUrl}/fuel/fraud-alerts/${id}`,
      { headers: this.getHeaders() }
    );
  }

  flagTransaction(id: string, data: { fraudType: string; reason: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/fuel/transactions/${id}/flag`,
      data,
      { headers: this.getHeaders() }
    );
  }

  resolveFraudAlert(id: string, data: { isFraud: boolean; resolution: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/fuel/fraud-alerts/${id}/resolve`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getFraudStats(startDate?: string, endDate?: string): Observable<ApiResponse<{ stats: any }>> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<ApiResponse<{ stats: any }>>(
      `${this.apiUrl}/fuel/fraud-stats`,
      { headers: this.getHeaders(), params }
    );
  }

  // Notifications
  sendNotification(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/notifications/send`,
      data,
      { headers: this.getHeaders() }
    );
  }
}
