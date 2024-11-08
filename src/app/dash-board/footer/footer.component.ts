import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  isSidebarOpen = false;
  currentUser: any;
  notificationsCount: number = 0;
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private socket: SocketService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.notificationService.notificationsCount$.subscribe((count) => {
      this.notificationsCount = count;
    });
  }
  // items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

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
    this.authService.logout().subscribe({
      next: (response) => {
        this.authService.setUserData(null);
        localStorage.removeItem('user');
        this.socket.disconnect();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
