import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  showAlert: boolean;
  alertMessage: string;
  alertType: string;

  constructor(private authservice: AuthService) {}
  forgetPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submit() {
    if (this.forgetPassword.valid) {
      this.authservice
        .forgetPassword(this.forgetPassword.value.email?.toString())
        .subscribe({
          next: (response) => {
            this.showAlert = true;
            this.alertMessage = 'Please check your email!';
            this.alertType = 'success';
          },
          error: (error) => {
            this.showAlert = true;
            this.alertMessage = error.error.message;
            this.alertType = 'danger';
          },
        });
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please provide your email';
      this.alertType = 'danger';
    }
  }
  get email() {
    return this.forgetPassword.get('email');
  }
}
