import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-facebook-redirect',
  templateUrl: './facebook-redirect.component.html',
  styleUrls: ['./facebook-redirect.component.scss'],
})
export class FacebookRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const type = params['provider'];
      if (code) {
        this.authservice.loginWithFacebook(code, type).subscribe(
          (response) => {
            localStorage.setItem('user', response.token);
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error(`Login with ${type} failed`, error);
            this.router.navigate(['/login']);
          }
        );
      }
    });
  }
}
