import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  postDescription: string = '';
  selectedFiles: any[] = [];
  isLiked: boolean = false;
  recommendadProfiles: any[] = [];
  commentsMap: { [key: string]: any[] } = {};
  suggestedprofile: any[] = Array(3);
  posts: any[] = [];
  comments: any[] = [];
  currentUser: any;
  show: boolean = false;

  commentForm = new FormGroup({
    comment: new FormControl('', Validators.required),
  });

  constructor(
    private postService: PostService,
    private authservice: AuthService
  ) {}

  fetchPosts() {
    this.postService.getUserPost().subscribe({
      next: (response) => {
        this.posts = response;
        console.log(response);
        this.checkIfUserHasLikedPost();
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
  toggleLiveStreamModal() {
    this.show = !this.show;
  }

  ngOnInit(): void {
    this.currentUser = this.authservice.getUserData;

    this.getRecommendedUsers();
    this.fetchPosts();
  }

  checkIfUserHasLikedPost() {
    this.posts.forEach((posts) => {
      posts.hasLiked = posts.likes.some(
        (like: any) => this.currentUser._id === like.userId
      );
    });
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
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('description', this.postDescription);
    for (let file of this.selectedFiles) {
      formData.append('files', file.file);
    }
    console.log(formData);

    this.postService.uploadPost(formData).subscribe({
      next: (response) => {
        console.log('Post uploaded successfully', response);
        this.fetchPosts();
        this.postDescription = '';
        this.selectedFiles = [];
      },
      error: (error) => {
        console.error('Error uploading post', error);
      },
    });
  }

  addLike(postId: string) {
    this.postService.addLike(postId).subscribe({
      next: (response) => {
        console.log(response);
        this.isLiked = true;
        this.fetchPosts();
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  deleteLike(postId: any) {
    this.postService.deleteLike(postId).subscribe({
      next: (response) => {
        console.log(response);
        this.fetchPosts();
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  postComment(postId: any) {
    if (this.commentForm.valid) {
      this.postService
        .addComment(postId, this.commentForm.value.comment.toString())
        .subscribe({
          next: (response) => {
            console.log(response);
            this.getPostComments(postId);
            this.commentForm.reset();
          },
          error: (error) => {
            console.log(error.error.message);
          },
        });
    }
  }

  getPostComments(postId: any) {
    this.postService.getPostComments(postId).subscribe({
      next: (response) => {
        console.log(response);
        this.commentsMap[postId] = response;
      },

      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
  deleteComment(commentId: any, postId: any) {
    this.postService.deleteComment(commentId).subscribe({
      next: (response) => {
        console.log(response);
        this.getPostComments(postId);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  getRecommendedUsers() {
    this.postService.getUsers().subscribe({
      next: (response) => {
        this.recommendadProfiles = response;
        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  followUser(userId: any, followIsTrue: boolean,index:number) {
    console.log(userId, followIsTrue);
    this.postService.followUser(userId, followIsTrue).subscribe({
      next: (response) => {
        console.log(response);
        this.recommendadProfiles[index].isFollowing = true;
      
        this.getRecommendedUsers();
    
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
