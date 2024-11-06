import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  userData: any;
  notifications: any[] = [];
  notificationCount: number = 0;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {
    this.authService.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notification) => {
      console.log('Fetched Notifications:', notification);
      this.notifications = notification;
    });
    this.notificationService.notificationsCount$.subscribe((count) => {
      this.notificationCount = count;
    });
  }

  markNotificationRead(notification: any) {
    this.notificationService.markAsRead(notification._id).subscribe({
      next: (response) => {
        console.log('Marked as read', response);

        // Find the notification in the array and mark it as read
        const index = this.notifications.findIndex(
          (n) => n._id === notification._id
        );
        if (index !== -1) {
          this.notifications[index].read = true; // Assuming isRead is a flag in your notification data structure
        }
        if (this.notificationCount > 0) {
          this.notificationCount -= 1;
        }

        this.notificationService.setNotificationsCount(this.notificationCount);
        this.router.navigate(['/dashboard/post', notification.contentId]);
      },
      error: (error) => {
        console.log('Got an error:', error);
      },
    });
  }

  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
}
