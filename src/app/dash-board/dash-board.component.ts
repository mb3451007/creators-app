import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent implements AfterViewInit {
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
    this.getNotifications();
  }
  ngAfterViewInit(): void {
    this.socket.connect(this.currentUser._id, this.currentUser.name);
  }
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
        this.unReadNotification += 1;
      }
    });
    this.notificationService.setNotificationsCount(this.unReadNotification);
  }
}
