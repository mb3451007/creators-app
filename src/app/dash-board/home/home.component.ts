import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConversationService } from 'src/app/services/conversation.service';
import { SocketService } from 'src/app/services/socket.service';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {
  isLoading = false; // Add this to your component
  postDescription: string = '';
  selectedFiles: Array<any> = [];
  isLiked: boolean = false;
  recommendadProfiles: any[] = [];
  commentsMap: { [key: string]: any[] } = {};
  suggestedprofile: any[] = Array(3);
  posts: any[] = [];
  comments: any[] = [];
  currentUser: any;
  show: boolean = false;
  currentPage: number = 1;
  limit: number = 3;
  totalPages: number = 0;
  showDelete: boolean = false;
  postDeletId: string = '';
  tier: string = 'free';

  commentForm = new FormGroup({
    comment: new FormControl('', Validators.required),
  });

  constructor(
    private postService: PostService,
    private authservice: AuthService,
    private conversationService: ConversationService,
    private socket: SocketService,
    private http: HttpClient
  ) {}

  fetchPosts() {
    this.postService.getUserPost(false).subscribe({
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

  toggleDeleteModal(postId: string) {
    this.showDelete = !this.showDelete;
    this.postDeletId = postId;
  }

  ngOnInit(): void {
    this.currentUser = this.authservice.getUserData;

    this.getRecommendedUsers(this.currentPage);
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

    // Reset file input value to allow selecting the same file again
    event.target.value = null;
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    this.isLoading = true; // Show the loader when submitting

    let formData = new FormData();
    formData.append('description', this.postDescription);
    formData.append('tier', this.tier);
    for (let file of this.selectedFiles) {
      formData.append('files', file.file);
    }
    console.log(formData, 'Form Data --------');

    this.postService.uploadPost(formData).subscribe({
      next: (response) => {
        console.log('Post uploaded successfully', response);

        this.fetchPosts();
        this.postDescription = '';
        this.selectedFiles = [];
        this.isLoading = false;
        this.tier = 'free';
      },
      error: (error) => {
        console.error('Error uploading post', error);
        this.isLoading = false; // Hide the loader after error
      },
      complete: () => {
        this.isLoading = false; // Ensure loader is hidden when request is complete
      },
    });
  }

  addLike(post: any) {
    this.postService.addLike(post._id, post.userId).subscribe({
      next: (response) => {
        this.isLiked = true;

        this.fetchPosts();
        if (post.userId !== this.currentUser._id) {
          this.socket.emit('post-liked', {
            likedBy: this.currentUser.name,
            contentId: post._id,
            userId: post.userId,
            mediaUrl: post.media[0], // Assuming media is an array of objects with 'url' property
          });
        }

        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  deleteLike(post: any) {
    this.postService.deleteLike(post._id, post.userId).subscribe({
      next: (response) => {
        console.log(response);
        this.fetchPosts();
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

  getRecommendedUsers(page: number) {
    this.postService.getUsers(page, this.limit).subscribe({
      next: (response: any) => {
        this.recommendadProfiles = response.users;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
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

  followUser(userId: any, followIsTrue: boolean, index: number) {
    console.log(userId, followIsTrue);
    this.postService.followUser(userId, followIsTrue).subscribe({
      next: (response) => {
        console.log(response);
        this.recommendadProfiles[index].isFollowing = true;
        this.conversationService.createOrAccessConversation(userId).subscribe({
          next: (response) => {
            console.log('conversation created');
          },
          error: (error) => {
            console.log('error: ', error);
          },
        });
        this.getRecommendedUsers(this.currentPage);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  deletePost() {
    console.log(this.postDeletId);
    this.postService.deletePost(this.postDeletId).subscribe({
      next: (response) => {
        console.log(response);

        this.posts = this.posts.filter((post) => post._id !== this.postDeletId);
        this.postDeletId = '';
        this.toggleDeleteModal(this.postDeletId);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  // getMediaUrl(media) {
  //   return this.postService.getMediaUrl(media);
  // }
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

  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }

  async buyNow() {
    const stripe = await loadStripe(
      'pk_test_51N2zfiBHAK3VyaqUHLxCAue1ZffFof5jE4X4lRfxvBqffzikRlcQTxj3Lrb3zbVgkmHSob3i2hidx0aQEP153HTM00rJFnDGJo'
    ); // Replace with your Stripe publishable key.

    this.http
      .post('http://localhost:3000/stripe/checkout', {
        priceId: 'price_1Qm5HJBHAK3VyaqUVYEijMtc', // Replace with your price ID.
      })
      .subscribe(async (response: any) => {
        if (response.url) {
          window.location.href = response.url; // Redirect to Stripe Checkout.
        } else {
          alert('Failed to create checkout session');
        }
      });
  }
}
