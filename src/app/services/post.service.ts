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
    return this.http.post(`${env.baseURL}/posts/create`, formdata);
  }

  getUserPost(): Observable<any> {
    return this.http.get(`${env.baseURL}/posts/`);
  }

  addLike(postId: string): Observable<any> {
    return this.http.post(`${env.baseURL}/like/add`, { postId });
  }

  deleteLike(postId: string): Observable<any> {
    return this.http.post(`${env.baseURL}/like/delete`, { postId });
  }
  addComment(postId: any, comment: string): Observable<any> {
    return this.http.post(`${env.baseURL}/comment/add`, { postId, comment });
  }

  getPostComments(postId: any): Observable<any> {
    return this.http.post(`${env.baseURL}/comment/get`, { postId });
  }
  deleteComment(commentId: any): Observable<any> {
    return this.http.delete(`${env.baseURL}/comment/delete/${commentId}`);
  }
  getUsers(): Observable<any> {
    return this.http.get(`${env.baseURL}/user/`);
  }

  followUser(userIdToFollow: any, followIsTrue: boolean): Observable<any> {
    return this.http.patch(`${env.baseURL}/follow/`, {
      userIdToFollow,
      followIsTrue,
    });
  }

  getMediaUrl(media: string): string {
    return `${env.baseURL}${media}`;
  }
}