import { Component } from '@angular/core';
import { projecTitle } from 'src/app/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedFiles: any[] = [];
  titleName = projecTitle;
  timePeriod :string= '1 month ago';
  userprofile:any[]=Array(6);
  suggestedprofile:any[]=Array(3);

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push({
          name: file.name,
          type: file.type,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
}
