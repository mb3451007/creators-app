import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { env } from '../environments/env.development';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  token: string | null = null;
  userId: string | null = null;
  user: User | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.token = user.token;
        this.user = user;
        this.userId = user._id;
      } else {
        this.token = null;
        this.user = null;
      }
    });
  }

  get getUserId() {
    return this.userId;
  }

  uploadPost(formdata: FormData): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.post(`${env.baseURL}/posts/create`, formdata, {
      headers,
    });
  }

  getUserPost(): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${env.baseURL}/posts/`, { headers });
  }

  addLike(postId: string): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${env.baseURL}/like/add`, { postId }, { headers });
  }

  deleteLike(postId: string): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.post(
      `${env.baseURL}/like/delete`,
      { postId },
      { headers }
    );
  }
  addComment(postId: any, comment: string): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    return this.http.post(
      `${env.baseURL}/comment/add`,
      { postId, comment },
      { headers }
    );
  }

  getPostComments(postId: any): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.post(
      `${env.baseURL}/comment/get`,
      { postId },
      { headers }
    );
  }
  deleteComment(commentId: any): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    return this.http.delete(`${env.baseURL}/comment/delete/${commentId}`, {
      headers,
    });
  }
  getUsers(): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${env.baseURL}/user/`, { headers });
  }

  followUser(userIdToFollow: any, followIsTrue: boolean): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.http.patch(
      `${env.baseURL}/follow/`,
      { userIdToFollow, followIsTrue },
      { headers }
    );
  }

  getMediaUrl(media: string): string {
    return `${env.baseURL}${media}`;
  }
}
