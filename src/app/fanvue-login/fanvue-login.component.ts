import { Component } from '@angular/core';
import { projecTitle } from '../constants';
@Component({
  selector: 'app-fanvue-login',
  templateUrl: './fanvue-login.component.html',
  styleUrls: ['./fanvue-login.component.scss']
})
export class FanvueLoginComponent {
titleName = projecTitle;
}
