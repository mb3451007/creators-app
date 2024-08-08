import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../environments/env.development';
import { map, Observable } from 'rxjs';
import { Conversation } from '../models/conversation';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  token: string | null = null;
  userId: string | null = null;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.user$.subscribe((user) => {
      this.token = user?.token || null;
      this.userId = user?._id || null;
    });
  }

  getAllConversations(): Observable<Conversation[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http
      .get<{ conversations: Conversation[] }>(
        `${env.baseURL}/conversation/all`,
        {
          headers,
        }
      )
      .pipe(map((response) => response.conversations));
  }

  getParticularConversation(receiverId: string): Observable<Conversation[]> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http
      .get<{ conversations: Conversation[] }>(
        `${env.baseURL}/conversation/${receiverId}`,
        {
          headers,
        }
      )
      .pipe(map((response) => response.conversations));
  }

  createOrAccessConversation(receiverId: String) {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.post(
      `${env.baseURL}/conversation/`,
      { receiverId },
      { headers }
    );
  }
}
