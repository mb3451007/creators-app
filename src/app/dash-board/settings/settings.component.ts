import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  selectedDiv: number = 0;
  showDetails: boolean = false;

  selectDiv(divNumber: number): void {
    this.selectedDiv = divNumber;
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }
}
