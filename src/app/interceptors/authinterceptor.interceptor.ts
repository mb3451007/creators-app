import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthinterceptorInterceptor implements HttpInterceptor {
  token: String | null = null;
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.token = user.token;
      }
    });

    if (this.token && request.url !== '/') {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('user');
          this.authService.setUserData(null);
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
