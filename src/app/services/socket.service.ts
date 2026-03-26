import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export type SocketConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private connectionState$ = new BehaviorSubject<SocketConnectionState>('disconnected');

  constructor(private authService: AuthService) {}

  connect(): void {
    const token = this.authService.getToken();
    if (!token) return;

    if (this.socket?.connected) return;

    this.connectionState$.next('connecting');

    this.socket = io(environment.socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.connectionState$.next('connected');
    });

    this.socket.on('disconnect', (reason) => {
      this.connectionState$.next('disconnected');
    });

    this.socket.on('connect_error', () => {
      this.connectionState$.next('error');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionState$.next('disconnected');
    }
  }

  getConnectionState(): Observable<SocketConnectionState> {
    return this.connectionState$.asObservable();
  }

  onTripEvent(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        this.connect();
      }
      const handler = (payload: any) => subscriber.next(payload);
      this.socket?.on(eventName, handler);
      return () => {
        this.socket?.off(eventName, handler);
      };
    });
  }

  joinTrip(tripId: string): void {
    this.socket?.emit('join:trip', tripId);
  }
}
