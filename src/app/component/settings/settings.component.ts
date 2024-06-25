import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  selectedDiv: number = 0; // Initially show the first div

  // Method to change the selected div
  selectDiv(divNumber: number): void {
    this.selectedDiv = divNumber;
  }
}
