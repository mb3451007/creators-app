import { Component } from '@angular/core';
import { projecTitle } from 'src/app/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  showHide: boolean = true;
  titleName = projecTitle;

  activeDiv: number = 1; // By default, the first div is active

  setActiveDiv(divNumber: number) {
    this.activeDiv = divNumber;
  }
  likedHide() {
    this.showHide = true;
  }

  purchaseHide() {
    this.showHide = false;
  }
}
