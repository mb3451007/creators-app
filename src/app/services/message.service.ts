import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { env } from '../environments/env.development';
import { Message } from '../models/message';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  token: string | null = null;
  user: User | null = null;
  userId: string | null = null;
  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.token = user.token;
        this.user = user;
        this.userId = user._id;
      }
    });
  }

  getAllMessages(conversationId: string): Observable<Message[]> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    return this.http
      .get<{ messages: Message[] }>(
        `${env.baseURL}/message/get/${conversationId}`,
        {
          headers,
        }
      )
      .pipe(map((response) => response.messages));
  }

  sendMessage(message: string, conversationId: string) {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.post(
      `${env.baseURL}/message/send`,
      { message, conversationId },
      { headers }
    );
  }
}
