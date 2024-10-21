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
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      this.userData = user;
    });
  }

  ngOnInit(): void {
    this.getNotifications();
  }
  getNotifications() {
    console.log('here');
    this.notificationService.getNotifications(this.userData._id).subscribe({
      next: (response: any) => {
        this.notifications = response.notification;
        console.log(response, 'Here');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
