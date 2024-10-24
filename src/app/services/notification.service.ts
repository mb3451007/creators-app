import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/env.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsCountSubject = new BehaviorSubject<string[]>([]);
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notificationsCount$ = this.notificationsCountSubject.asObservable();
  notifications$ = this.notificationsSubject.asObservable();
  constructor(private http: HttpClient) {}

  setNotificationsCount(data: any) {
    this.notificationsCountSubject.next(data);
  }
  setNotificationsData(data: any) {
    this.notificationsSubject.next(data);
  }
  getNotificationsData() {
    return this.notificationsSubject.value;
  }
  getNotificationsCount() {
    return this.notificationsCountSubject.value;
  }
  getNotifications(userId: string) {
    return this.http.get(`${env.baseURL}/notification/${userId}`);
  }

  markAsRead(notificationId: string) {
    return this.http.put(
      `${env.baseURL}/notification/${notificationId}/read`,
      {}
    );
  }
}
