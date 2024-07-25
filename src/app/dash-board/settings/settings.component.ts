import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  selectedDiv: number = 0;
  
  selectDiv(divNumber: number): void {
    this.selectedDiv = divNumber;
  }
}
