import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../utils/passwordValidator';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  showAlert: boolean;
  alertMessage: string;
  alertType: string;
  token: string;
  passwordVisibility: string;
  passwordCnfrmVisibility: string;
  isloading: boolean = false;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    console.log(this.token);
  }

  resetPasswordForm = new FormGroup(
    {
      password: new FormControl('', Validators.required),
      cpassword: new FormControl('', Validators.required),
    },
    {
      validators: passwordMatchValidator,
    }
  );

  resetPasswordNow() {
    this.isloading = true;
    if (this.resetPasswordForm.valid) {
      if (!this.token) {
        this.isloading = false;
        this.showAlert = true;
        this.alertMessage = 'Please provide valid link';
        this.alertType = 'danger';
      } else {
        this.authservice
          .resetPassword(
            this.resetPasswordForm.value.password?.toString(),
            this.token
          )
          .subscribe({
            next: (response) => {
              this.isloading = false;
              this.showAlert = true;
              this.alertMessage = 'Password has been changed';
              this.alertType = 'success';
            },
            error: (error) => {
              this.isloading = false;
              this.showAlert = true;
              this.alertMessage = error.error.message;
              this.alertType = 'danger';
            },
          });
      }
    } else {
      this.isloading = false;
      this.showAlert = true;
      this.alertMessage = 'Please provide your password';
      this.alertType = 'danger';
    }
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
  }

  togglePasswordVisibility() {
    this.passwordVisibility =
      this.passwordVisibility === 'password' ? 'text' : 'password';
  }
  toggleConfrmPasswordVisibility() {
    this.passwordCnfrmVisibility =
      this.passwordCnfrmVisibility === 'password' ? 'text' : 'password';
  }
}
