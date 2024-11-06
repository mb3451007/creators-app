import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { env } from '../environments/env.development';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  activeUsers$ = this.activeUsersSubject.asObservable();
  currentUser: any;
  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user && !this.socket) {
        this.connect(user._id, user.name);
      } else if (!user && this.socket) {
        this.disconnect();
      }
    });
  }
  connect(userId: string, name: string) {
    if (!this.socket) {
      this.socket = io(`${env.baseURL}`, {
        withCredentials: true,
        forceNew: true,
      });
      console.log('Here From Sockets it is running fine ---------------------');
      const data = { userId, name };
      this.emit('AddUser', data);
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });
    }
  }
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string, callback: (date: any) => void) {
    this.socket.on(event, callback);
  }

  addUser(userId: string, name: string): void {
    const data = { userId, name };
    this.emit('AddUser', data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
