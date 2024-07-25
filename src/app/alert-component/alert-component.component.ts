import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrls: ['./alert-component.component.scss'],
})
export class AlertComponentComponent {
  @Input() showAlert: boolean;
  @Input() alertMessage: string;
  @Input() alertType: string;

  closeAlert() {
    this.showAlert = false;
  }
}
