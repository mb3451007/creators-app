import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  isSidebarOpen = false;
  currentUser: any;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private postService: PostService
  ) {
    this.authservice.user$.subscribe((userData) => {
      this.currentUser = userData;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
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
