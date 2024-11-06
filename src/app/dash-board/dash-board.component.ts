import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent implements AfterViewInit, OnInit {
  currentUser: any;
  notifications: any;
  unReadNotification: number = 0;
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private socket: SocketService
  ) {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.notificationService.notificationsCount$.subscribe((count) => {
      this.unReadNotification = count;
    });
  }
  ngOnInit() {
    this.getNotifications();
    this.socket.connect(this.currentUser._id, this.currentUser.name);
    this.socket.on('notification', (notification) => {
      this.notificationService.notifications$.subscribe((notifications) => {
        notifications.unshift(notification);
        console.log(this.notifications);
        this.unReadNotification =
          this.notificationService.getNotificationsCount();
        console.log(
          this.unReadNotification,
          'Consoliong notification after gettin new'
        );
        this.unReadNotification += 1;
        this.notificationService.setNotificationsCount(this.unReadNotification);
      });
    });
  }
  ngAfterViewInit(): void {}
  getNotifications() {
    console.log('here');
    this.notificationService.getNotifications(this.currentUser._id).subscribe({
      next: (response: any) => {
        this.notifications = response.notification;
        this.notificationService.setNotificationsData(response.notification);
        console.log(response.notification, 'Here');
        this.getNotificationCount();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getNotificationCount() {
    this.notifications.forEach((notification) => {
      if (notification.read === false) {
        this.unReadNotification = this.unReadNotification + 1;
      }
    });

    this.notificationService.setNotificationsCount(this.unReadNotification);
    this.notificationService.notificationsCount$.subscribe((count) => {
      this.unReadNotification = count;
      console.log(
        'Notification Count is :',
        this.unReadNotification,
        ' True count is :',
        count
      );
    });
  }
}
