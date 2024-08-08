import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authservice: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const protectedRoutes: string[] = [
    '/dashboard',
    '/dashboard/home',
    '/dashboard/profile',
    '/dashboard/suggested',
    '/dashboard/discover',
    '/dashboard/setting',
  ];
  const unprotectedRoutes: string[] = ['/', '/login'];

  if (authservice.getUserData === null && protectedRoutes.includes(state.url)) {
    router.navigate(['']);

    return false;
  }
  if (
    authservice.getUserData !== null &&
    unprotectedRoutes.includes(state.url)
  ) {
    router.navigate(['dashboard']);

    return false;
  }
  return true;
};
