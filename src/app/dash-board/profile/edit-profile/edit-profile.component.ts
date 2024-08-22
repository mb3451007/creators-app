import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { env } from 'src/app/environments/env.development';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  bannerUrl: string | ArrayBuffer | null = null;
  selectedFiles: { profile?: File; cover_image?: File } = {};
  currentUser: any = {};
  constructor(
    private fb: FormBuilder,

    private authService: AuthService,
    private postService: PostService
  ) {
    this.profileForm = this.fb.group({
      profileImage: [null],
      coverImage: [null],
    });

    this.currentUser = this.authService.getUserData;
    console.log(this.currentUser);
  }

  ngOnInit(): void {
    this.updatebanner();
  }
  updatebanner() {
    this.bannerUrl = this.currentUser.cover_image
      ? this.getMediaUrl(this.currentUser.cover_image)
      : this.getMediaUrl(`${env.baseURL}/uploads/default_profile_picture.png`);
  }
  updateUserProfile() {
    this.authService.updateUserProfileImages(this.selectedFiles).subscribe({
      next: (response) => {
        this.currentUser = {
          ...this.currentUser,
          profile: response.profile || this.currentUser.profile,
          cover_image: response.cover_image || this.currentUser.cover_image,
        };

        this.authService.setUserData(this.currentUser);

        console.log(this.currentUser);
        this.updatebanner();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onFileSelect(event: Event, type: 'profile' | 'cover_image') {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFiles[type] = file;

      this.updateUserProfile();
    }
  }

  getMediaUrl(media) {
    return this.postService.getMediaUrl(media);
  }
}
