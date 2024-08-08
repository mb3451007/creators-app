import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  currentUser: any;
  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getUserData;
  }

  activeDiv = 0;

  showDiv(divNumber: number): void {
    this.activeDiv = divNumber;
  }

  deleteUser() {
    this.authService.deleteUser().subscribe({
      next: (response) => {
        console.log('User deleted successfully');
        localStorage.removeItem('user');
        this.authService.setUserData(null);
        this.router
          .navigate(['/login'])
          .then(() => {
            console.log('Navigated to login');
          })
          .catch((error) => {
            console.error('Navigation error:', error);
          });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
