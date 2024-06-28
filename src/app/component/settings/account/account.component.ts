import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  

  activeDiv = 0;

  showDiv(divNumber: number): void {
    this.activeDiv = divNumber;
  }
}
