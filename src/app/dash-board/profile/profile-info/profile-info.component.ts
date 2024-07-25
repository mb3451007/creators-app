import { Component } from '@angular/core';
import { projecTitle } from 'src/app/constants';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent {
  titleName = projecTitle;
}
