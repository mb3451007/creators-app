import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    this.userDataSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user$ = this.userDataSubject.asObservable();
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

  setUserData(data: any | null) {
    localStorage.setItem('user', JSON.stringify(data));
    this.userDataSubject.next(data);
  }

  get getUserData() {
    return this.userDataSubject.value;
  }
}
