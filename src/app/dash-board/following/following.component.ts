import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent {
  suggestedprofile: any[] = Array(3);
  recommendadProfiles: any[] = [];
  currentPage: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  isloading: boolean = false;

  constructor(private postService: PostService) {
    this.getRecommendedUsers(this.currentPage);
  }

  getRecommendedUsers(page: number) {
    this.isloading = true;
    this.postService.getFollowingUsers(page, this.limit).subscribe({
      next: (response: any) => {
        this.recommendadProfiles = response.users;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        console.log(response);
        this.isloading = false;
      },
      error: (error) => {
        console.log(error.error.message);
        this.isloading = false;
      },
    });
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
  followUser(userId: any, followIsTrue: boolean, index: number) {
    console.log(userId, followIsTrue);
    this.postService.followUser(userId, followIsTrue).subscribe({
      next: (response) => {
        console.log(response);
        this.recommendadProfiles[index].isFollowing = true;

        this.getRecommendedUsers(this.currentPage);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
