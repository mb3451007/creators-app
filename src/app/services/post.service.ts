import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { env } from '../environments/env.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  token: string | null = null;
  userId: string | null = null;

  constructor(private router: Router, private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      const userParsed = JSON.parse(user);
      this.token = userParsed.token;
      this.userId = userParsed._id;
    }
    console.log(this.token);
  }

  get getUserId() {
    return this.userId;
  }

  uploadPost(formdata: FormData): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    console.log(headers);
    return this.http.post(`${env.baseURL}/posts/create`, formdata, {
      headers,
    });
  }

  getUserPost(): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });
    return this.http.post(`${env.baseURL}/posts/`, this.userId, { headers });
  }

  addLike(postId: string): Observable<any> {
    console.log(postId);
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
}
