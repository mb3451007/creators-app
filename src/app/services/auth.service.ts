import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { env } from '../environments/env.development';
import { User } from '../models/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userDataSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      this.userDataSubject.next(user);
      this.user$ = this.userDataSubject.asObservable();
    }
  }
  setUserData(data: any | null) {
    if (data === null) {
      localStorage.removeItem('user');
    } else {
      localStorage.setItem('user', JSON.stringify(data));
    }
    console.log(data);
    this.userDataSubject.next(data);
  }

  get getUserData() {
    return this.userDataSubject.value;
  }

  get UserToken() {
    return this.userDataSubject.value.token;
  }

  loginNow(email: any, password: any): Observable<any> {
    return this.http.post(env.baseURL + '/login', {
      email,
      password,
    });
  }

  logout(): Observable<any> {
    return this.http.post(env.baseURL + '/logout', {});
  }

  signUp(
    name: any,
    email: any,
    username: any,
    password: any,
    age: any,
    gender: any,
    role: any
  ) {
    const payload = { name, email, username, password, age, gender, role };
    return this.http.post(env.baseURL + '/register', payload);
  }

  verifyUser(userId: string, token: string): Observable<any> {
    return this.http.get(`${env.baseURL}/verify/${userId}/${token}`);
  }

  forgetPassword(email: any): Observable<any> {
    return this.http.post(`${env.baseURL}/forgetpassword`, { email });
  }

  resetPassword(password: any, token: string): Observable<any> {
    return this.http.patch(`${env.baseURL}/password/reset`, {
      password,
      token,
    });
  }

  loginWithFacebook(code: any, type: string): Observable<any> {
    if (type === 'facebook') {
      return this.http.post(`${env.baseURL}/auth/facebook`, {
        code,
      });
    }

    return this.http.post(`${env.baseURL}/auth/google`, {
      code,
    });
  }

  loginWithUid(userId: any): Observable<any> {
    return this.http.post(`${env.baseURL}/login`, { userId });
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${env.baseURL}/user/delete`);
  }

  updateUserProfileImages(files?: {
    profile?: File;
    cover_image?: File;
  }): Observable<any> {
    const formData = new FormData();
    if (files.profile) {
      formData.append('profile', files.profile);
    }

    if (files.cover_image) {
      formData.append('cover_image', files.cover_image);
    }

    return this.http.patch(`${env.baseURL}/user/update`, formData);
  }
  updateUserProfileInfo(
    name?: string,
    location?: string,
    bio?: string
  ): Observable<any> {
    const formData = new FormData();
    if (name) {
      formData.append('name', name);
    }

    if (location) {
      formData.append('location', location);
    }

    if (bio) {
      formData.append('bio', bio);
    }

    return this.http.patch(`${env.baseURL}/user/update`, formData);
  }
}
