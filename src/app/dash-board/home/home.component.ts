import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  timePeriod :string= '1 month ago';
  userprofile:any[]=Array(6);
  suggestedprofile:any[]=Array(3);
}