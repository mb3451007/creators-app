import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  message: string = '';
  alertType: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    const token = this.route.snapshot.paramMap.get('token');
    console.log('id: ' + userId + ' token: ' + token);
    if (userId && token) {
      this.authservice.verifyUser(userId, token).subscribe({
        next: (response) => {
          this.message = response.message;
          this.alertType = 'success';
        },
        error: (error) => {
          this.message = error.error.message;
          this.alertType = 'danger';
        },
      });
    } else {
      this.message = 'Invalid verification link';
      this.alertType = 'danger';
    }
  }
}
