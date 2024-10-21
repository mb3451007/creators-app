import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { env } from '../environments/env.development';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {}
  connect(userId: string, name: string) {
    if (!this.socket) {
      this.socket = io(`${env.baseURL}`, {
        withCredentials: true,
        forceNew: true,
      });
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
    }
  }
}
