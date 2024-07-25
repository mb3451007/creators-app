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
    if (this.resetPasswordForm.valid) {
      if (!this.token) {
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
              this.showAlert = true;
              this.alertMessage = 'Password has been changed';
              this.alertType = 'success';
            },
            error: (error) => {
              this.showAlert = true;
              this.alertMessage = error.error.message;
              this.alertType = 'danger';
            },
          });
      }
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please provide your password';
      this.alertType = 'danger';
    }
  }
}
