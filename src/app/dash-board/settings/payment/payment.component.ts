import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  activeDiv = 0;

  showDiv(divNumber: number): void {
    this.activeDiv = divNumber;
  }
}
