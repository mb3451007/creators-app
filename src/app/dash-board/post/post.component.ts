import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  postId: any;
  post: any;
  currentUser: any;
  isLiked: boolean = false;
  comments: any[] = [];
  commentsMap: { [key: string]: any[] } = {};
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private socket: SocketService
  ) {}
  commentForm = new FormGroup({
    comment: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('postId') || '';
    console.log(this.postId);
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    if (this.postId) {
      this.fetchSinglePost(this.postId);
    }
  }

  fetchSinglePost(postId: any) {
    this.postService.getSinglePost(postId).subscribe({
      next: (response: any) => {
        console.log(response.post);
        this.post = response.post;
        this.post.hasLiked = this.post.likes.some(
          (like: any) => this.currentUser._id === like.userId
        );
      },
      error: (error) => {
        console.log(error);
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

            this.post.totalComments += 1;

            this.commentForm.reset();
          },
          error: (error) => {
            console.log(error.error.message);
          },
        });
    }
  }
  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
  deleteComment(commentId: any, postId: any) {
    this.postService.deleteComment(commentId).subscribe({
      next: (response) => {
        console.log(response);
        this.getPostComments(postId);

        this.post.totalComments -= 1;
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
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
  deleteLike(post: any) {
    this.postService.deleteLike(post._id, post.userId).subscribe({
      next: (response) => {
        console.log(response);
        this.postId = post._id;
        this.fetchSinglePost(this.postId);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
  addLike(post: any) {
    this.postService.addLike(post._id, post.userId).subscribe({
      next: (response) => {
        if (post.userId !== this.currentUser._id) {
          this.socket.emit('post-liked', {
            likedBy: this.currentUser.name,
            contentId: post._id,
            userId: post.userId,
          });
        }
        console.log(response);
        this.isLiked = true;
        this.fetchSinglePost(this.postId);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
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
  toggleDeleteModal(postId: string) {}
}
