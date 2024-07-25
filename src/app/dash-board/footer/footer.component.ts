import { Component } from '@angular/core';
import { projecTitle } from 'src/app/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isSidebarOpen = false;
  titleName = projecTitle;
  
  // items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
