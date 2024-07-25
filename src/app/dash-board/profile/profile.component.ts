import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userData: any;
  constructor(private authservice: AuthService) {
    this.authservice.user$.subscribe((res) => (this.userData = res));
  }

  //before code
  showHide: boolean = true;

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
