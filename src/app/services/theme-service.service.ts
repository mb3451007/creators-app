import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {
  private isDarkMode = false;
  mode:string='';
  constructor() { }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  getThemeMode(){
    if(this.isDarkMode === false){
      this.mode = 'OFF'
    }
    else{
      this.mode = 'ON'
    }
  }

  get currentTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
}
