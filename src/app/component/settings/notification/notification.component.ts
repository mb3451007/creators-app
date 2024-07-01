import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  activeDiv = 0;

  showDiv(divNumber: number): void {
    this.activeDiv = divNumber;
  }
}
