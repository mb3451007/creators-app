import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  userData: any;
  notifications: any[] = [];
  unReadNotification: number = 0;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notification) => {
      this.notifications = notification;
    });
  }

  markNotificationAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: (response) => {
        console.log('Notification is read now');
        const updatedNotification = this.notifications.map((notification) => {
          if (notification._id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        });

        this.notifications = updatedNotification;
        this.notificationService.setNotificationsData(this.notifications);
        this.updateNotificationCount();
      },
      error: (error) => {
        console.log('Some Erroe Occured');
      },
    });
  }
  updateNotificationCount() {
    this.unReadNotification = this.notifications.filter(
      (notification) => !notification.read
    ).length;
    this.notificationService.setNotificationsCount(this.unReadNotification);
  }
}
