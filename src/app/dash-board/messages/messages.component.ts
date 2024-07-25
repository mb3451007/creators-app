import { Component } from '@angular/core';
import { projecTitle } from 'src/app/constants';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  selectedDiv: number = 0;
  showHide: boolean = true;
  titleName = projecTitle;

  activeDiv: number = 1; // By default, the first div is active
  
  selectDiv(divNumber: number): void {
    this.selectedDiv = divNumber;
  }
  setActiveDiv(divNumber: number) {
    this.activeDiv = divNumber;
  }
  chatHide() {
    this.showHide = true;
  }

  mediaHide() {
    this.showHide = false;
  }
}
