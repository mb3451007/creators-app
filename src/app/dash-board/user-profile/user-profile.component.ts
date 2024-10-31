import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [
    trigger('fadeOut', [
      // Transition for element enterin
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      // Transition for element leaving (fade-out)
      transition(':leave', [animate('500ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  selectedFiles: any[] = [];
  userprofile: any[] = Array(6);
  suggestedprofile: any[] = Array(3);
  showHide: boolean = true;
  currentUser: any;
  recommendedProfiles: any[] = [];
  currentPage: number = 1;
  limit: number = 3;
  totalPages: number = 0;
  searchControl = new FormControl();
  searchUserResult: any[] = [];
  userData: any;
  posts: any[] = [];
  showDelete: boolean = false;
  postDeletId: string = '';
  isLiked: boolean = false;
  commentsMap: { [key: string]: any[] } = {};
  userId: string;
  private subscription: Subscription = new Subscription();
  commentForm = new FormGroup({
    comment: new FormControl('', Validators.required),
  });
  constructor(
    private authService: AuthService,
    private postService: PostService,
    private conversationService: ConversationService,
    private socket: SocketService,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData;

    this.getRecommendedUsers(this.currentPage);
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.getSingleUser(this.userId);
      this.fetchPosts(this.userId);
    });

    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300), // Wait for 300ms pause in events
          switchMap((query) => this.authService.searchUsers(query)) // Make the API call
        )
        .subscribe((results) => {
          this.searchUserResult = results;
          console.log(results, 'Here are the results');
        })
    );
  }

  getSingleUser(userId: string) {
    this.authService.getSingleUser(userId).subscribe({
      next: (response) => {
        this.userData = response;
        console.log(this.userData, 'Hereeeeeeeeeeeeeeeee is the data');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  toggleDeleteModal(postId: string) {
    this.showDelete = !this.showDelete;
    this.postDeletId = postId;
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

  followUser(userId: any, followIsTrue: boolean) {
    console.log(userId, followIsTrue);
    this.postService.followUser(userId, followIsTrue).subscribe({
      next: (response) => {
        console.log(response);

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

  nextPage() {
    console.log('clicked');
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getRecommendedUsers(this.currentPage);
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getRecommendedUsers(this.currentPage);
    }
  }
  scrollImages(direction: string) {
    const container = document.querySelector('.image-container');
    if (container) {
      const scrollAmount = container.clientWidth / 1; // Scroll half the width of the container
      if (direction === 'next') {
        container.scrollLeft += scrollAmount;
      } else if (direction === 'prev') {
        container.scrollLeft -= scrollAmount;
      }
    }
  }
  addLike(post: any) {
    this.postService.addLike(post._id, post.userId).subscribe({
      next: (response) => {
        this.isLiked = true;

        this.fetchPosts(this.userId);
        if (post.userId !== this.currentUser._id) {
          this.socket.emit('post-liked', {
            likedBy: this.currentUser.name,
            contentId: post._id,
            userId: post.userId,
          });
        }
        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
  fetchPosts(userId: string) {
    this.postService.getSingleUserPost(userId).subscribe({
      next: (response) => {
        this.posts = response;
        console.log(response, 'POSTsssssssssss are hereeeeeeee');
        this.checkIfUserHasLikedPost();
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
  checkIfUserHasLikedPost() {
    this.posts.forEach((posts) => {
      posts.hasLiked = posts.likes.some(
        (like: any) => this.currentUser._id === like.userId
      );
    });
  }
  deleteLike(post: any) {
    this.postService.deleteLike(post._id, post.userId).subscribe({
      next: (response) => {
        console.log(response);
        this.fetchPosts(this.userId);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  postComment(commentPost: any) {
    if (this.commentForm.valid) {
      let postId = commentPost._id;
      this.postService
        .addComment(postId, this.commentForm.value.comment.toString())
        .subscribe({
          next: (response) => {
            console.log(response);
            if (commentPost.userId !== this.currentUser._id) {
              this.socket.emit('post-comment', {
                commentBy: this.currentUser.name,
                contentId: postId,
                userId: commentPost.userId,
              });
            }
            this.getPostComments(postId);
            const post = this.posts.find((post) => post._id === postId);
            if (post) {
              post.totalComments += 1;
            }
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
        const post = this.posts.find((post) => post._id === postId);
        if (post) {
          post.totalComments -= 1;
        }
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
