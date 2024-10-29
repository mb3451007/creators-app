import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConversationService } from 'src/app/services/conversation.service';
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
  recommendedProfiles: any[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 0;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData;
    this.getRecommendedUsers(this.currentPage);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      this.currentPage += 1;
      this.loadMoreProfiles();
    }
  }
  loadMoreProfiles() {
    this.postService
      .getUsers(this.currentPage, this.limit)
      .subscribe((response) => {
        this.recommendedProfiles.push(...response.users);
      });
  }
  getRecommendedUsers(page: number) {
    console.log(this.currentPage);
    this.postService.getUsers(page, this.limit).subscribe({
      next: (response: any) => {
        this.recommendedProfiles = response.users;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
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
  onSubmit() {
    console.log('Clicked');
  }

  followUser(userId: any, followIsTrue: boolean, index: number) {
    console.log(userId, followIsTrue);
    this.postService.followUser(userId, followIsTrue).subscribe({
      next: (response) => {
        console.log(response);
        this.recommendedProfiles[index].isFollowing = true;
        this.conversationService.createOrAccessConversation(userId).subscribe({
          next: (response) => {
            console.log('conversation created');
            this.getRecommendedUsers(this.currentPage);
          },
          error: (error) => {
            console.log('error: ', error);
          },
        });
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
}
