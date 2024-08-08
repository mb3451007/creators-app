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

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.authservice.logout().subscribe({
      next: (response) => {
        this.authservice.setUserData(null);
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
