import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DashBoardModule } from './dash-board/dash-board.module';
import { FanvueLoginComponent } from './fanvue-login/fanvue-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FanvueSignupComponent } from './fanvue-signup/fanvue-signup.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { FormValidationComponent } from './form-validation/form-validation.component';

import { AlertComponentComponent } from './alert-component/alert-component.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FacebookRedirectComponent } from './facebook-redirect/facebook-redirect.component';
import { AuthinterceptorInterceptor } from './interceptors/authinterceptor.interceptor';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    FanvueLoginComponent,
    FanvueSignupComponent,
    EmailVerificationComponent,
    FormValidationComponent,
    AlertComponentComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    FacebookRedirectComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,
    BrowserAnimationsModule,
    DashBoardModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthinterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
