import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { passwordMatchValidator } from '../utils/passwordValidator';
import { env } from '../environments/env.development';

@Component({
  selector: 'app-fanvue-signup',
  templateUrl: './fanvue-signup.component.html',
  styleUrls: ['./fanvue-signup.component.scss'],
})
export class FanvueSignupComponent {
  constructor(private authservice: AuthService) {}

  showAlert: boolean;
  alertMessage: string;
  alertType: string;
  passwordVisibility:  string  = 'password';
  passwordCnfrmVisibility: string = 'password';
  isloading: boolean = false;

  signUpForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(10),
        Validators.max(90),
      ]),
      password: new FormControl('', [Validators.required]),
      cpassword: new FormControl('', [Validators.required]),
      gender: new FormControl('', Validators.required),
    },
    { validators: passwordMatchValidator }
  );

  signUpNow() {
    this.isloading = true;
    if (this.signUpForm.valid) {
      this.authservice
        .signUp(
          this.signUpForm.value.name?.toString(),
          this.signUpForm.value.email?.toString(),
          this.signUpForm.value.username?.toString(),
          this.signUpForm.value.password?.toString(),
          this.signUpForm.value.age?.toString(),
          this.signUpForm.value.gender?.toString(),
          'subscriber'
        )
        .subscribe({
          next: (response) => {
            this.isloading = false;
            this.showAlert = true;
            this.alertMessage = 'Registered succesfully! Please verify email';
            this.alertType = 'success';
            console.log(response);
          },
          error: (error) => {
            this.isloading = false;
            this.showAlert = true;
            this.alertMessage = error.error.message;
            this.alertType = 'danger';
            console.log(error.error.message);
          },
        });
    } else {
      this.showAlert = true;
      this.alertMessage = 'Please fill complete form';
      this.alertType = 'danger';
      this.isloading = false;
    }
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
  }

  get name() {
    return this.signUpForm.get('name');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get username() {
    return this.signUpForm.get('username');
  }
  get password() {
    return this.signUpForm.get('password');
  }

  get age() {
    return this.signUpForm.get('age');
  }

  get gender() {
    return this.signUpForm.get('gender');
  }
  get cpassword() {
    return this.signUpForm.get('cpassword');
  }

  togglePasswordVisibility() {
    this.passwordVisibility =
      this.passwordVisibility === 'password' ? 'text' : 'password';
  }
  toggleConfrmPasswordVisibility() {
    this.passwordCnfrmVisibility =
      this.passwordCnfrmVisibility === 'password' ? 'text' : 'password';
  }
  loginWithFacebook() {
    window.location.href = `${env.baseURL}/auth/facebook`;
  }
}
