import { Component } from '@angular/core';

@Component({
  selector: 'app-suggested-creator',
  templateUrl: './suggested-creator.component.html',
  styleUrls: ['./suggested-creator.component.scss']
})
export class SuggestedCreatorComponent {
  showHide: boolean = true;

  activeDiv: number = 1; // By default, the first div is active

  setActiveDiv(divNumber: number) {
    this.activeDiv = divNumber;
  }
  postHide() {
    this.showHide = true;
  }

  mediaHide() {
    this.showHide = false;
  }
}
