import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FanvueLoginComponent } from './fanvue-login/fanvue-login.component';
import { authGuard } from './guards/auth.guard';
import { FanvueSignupComponent } from './fanvue-signup/fanvue-signup.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FacebookRedirectComponent } from './facebook-redirect/facebook-redirect.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  { path: 'login', component: FanvueLoginComponent, canActivate: [authGuard] },
  { path: 'auth/facebook/callback', component: FacebookRedirectComponent },

  { path: 'verify/:id/:token', component: EmailVerificationComponent },
  { path: 'resetpassword/:token', component: ResetPasswordComponent },

  { path: 'forget', component: ForgetPasswordComponent },

  {
    path: 'signup',
    component: FanvueSignupComponent,
    canActivate: [authGuard],
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./dash-board/dash-board.module').then((m) => m.DashBoardModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
