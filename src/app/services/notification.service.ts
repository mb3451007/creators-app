import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/env.development';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotifications(userId: string) {
    return this.http.get(`${env.baseURL}/notification/${userId}`);
  }

  markAsRead(notificationId: string) {
    return this.http.put(
      `${env.baseURL}/notifications/${notificationId}/read`,
      {}
    );
  }
}
