import { Component } from '@angular/core';
import { projecTitle } from 'src/app/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  titleName = projecTitle;
}
