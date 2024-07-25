import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  isSidebarOpen = false;
  constructor(private authservice: AuthService, private router: Router) {}
  // items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.authservice.logout().subscribe({
      next: (response) => {
        console.log(response);
        localStorage.removeItem('user');
        this.authservice.setUserData(null);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log('error is: ' + error.message);
        console.log(error);
      },
    });
  }
}
