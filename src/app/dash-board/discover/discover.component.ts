import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent implements OnInit {
  selectedFiles: any[] = [];
  userprofile: any[] = Array(6);
  suggestedprofile: any[] = Array(3);
  showHide: boolean = true;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData;
  }
  activeDiv: number = 1; // By default, the first div is active

  setActiveDiv(divNumber: number) {
    this.activeDiv = divNumber;
  }
  postHide() {
    this.showHide = true;
  }

  mediaHide() {
    this.showHide = false;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push({
          name: file.name,
          type: file.type,
          url: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
}
