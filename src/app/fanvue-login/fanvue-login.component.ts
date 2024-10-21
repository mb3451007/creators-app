import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from '../environments/env.development';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-fanvue-login',
  templateUrl: './fanvue-login.component.html',
  styleUrls: ['./fanvue-login.component.scss'],
})
export class FanvueLoginComponent implements OnInit {
  showAlert: boolean;
  alertMessage: string;
  alertType: string;
  passwordVisibility: string = 'password';
  userId: any;
  isloading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authservice: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'];
      if (this.userId) {
        console.log(this.userId);

        this.authservice.loginWithUid(this.userId).subscribe({
          next: (response) => {
            this.authservice.setUserData(response);

            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.log(error.error.message);
            this.alertType = 'danger';
            this.alertMessage = error.error.message;
            this.showAlert = true;
          },
        });
      }
    });
  }

  login() {
    this.isloading = true;
    if (this.loginForm.valid) {
      this.authservice
        .loginNow(
          this.loginForm.value.email?.toString(),
          this.loginForm.value.password?.toString()
        )
        .subscribe({
          next: (response) => {
            this.isloading = false;
            console.log(response);
            this.authservice.setUserData(response);
            this.socketService.connect(response._id, response.name);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isloading = false;
            this.alertType = 'danger';
            this.alertMessage = error.error.message;
            this.showAlert = true;
            console.log(error.error.message);
          },
        });
    } else {
      this.isloading = false;
      this.alertType = 'danger';
      this.alertMessage = 'Please provide your credentials';
      this.showAlert = true;
    }
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.passwordVisibility =
      this.passwordVisibility === 'password' ? 'text' : 'password';
  }

  loginWithFacebook() {
    window.location.href = `${env.baseURL}/auth/facebook`;
  }
  loginWithGoogle() {
    window.location.href = `${env.baseURL}/auth/google`;
  }
}
