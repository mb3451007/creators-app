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
  isloading: boolean = false;

  constructor(private authservice: AuthService) {}
  forgetPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submit() {
    this.isloading = true;
    if (this.forgetPassword.valid) {
      this.authservice
        .forgetPassword(this.forgetPassword.value.email?.toString())
        .subscribe({
          next: (response) => {
            this.isloading = false;
            this.showAlert = true;
            this.alertMessage = 'Please check your email!';
            this.alertType = 'success';
          },
          error: (error) => {
            this.isloading = false;
            this.showAlert = true;
            this.alertMessage = error.error.message;
            this.alertType = 'danger';
          },
        });
    } else {
      this.isloading = false;
      this.showAlert = true;
      this.alertMessage = 'Please provide your email';
      this.alertType = 'danger';
    }
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
  }
  get email() {
    return this.forgetPassword.get('email');
  }
}
