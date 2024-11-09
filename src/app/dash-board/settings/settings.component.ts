import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  selectedDiv: number = 0;
  showDetails: boolean = false;

  // mobile viewport
  selectedDivModile: number | null = null;

  selectDivMobileport(divNumber: number) {
    this.selectedDivModile = divNumber;
  }

  goBack() {
    this.selectedDivModile = null;
  }
  // 

  selectDiv(divNumber: number): void {
    this.selectedDiv = divNumber;
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }
}
