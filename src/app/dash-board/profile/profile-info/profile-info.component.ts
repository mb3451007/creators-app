import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { updateFormValidator } from 'src/app/utils/updateFormValidator';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
  currentUser: any = {};
  updateUserForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData;
    this.initializeForm();
  }

  initializeForm() {
    this.updateUserForm = new FormGroup(
      {
        name: new FormControl(this.currentUser.name),
        location: new FormControl(this.currentUser.location),
        bio: new FormControl(this.currentUser.bio),
      },
      { validators: updateFormValidator(this.currentUser) }
    );
  }

  onUpdateUserFormSubmit() {
    if (this.updateUserForm.invalid) {
      console.log('Form is invalid or unchanged.');
      return;
    }

    const updatedName = this.updateUserForm.value.name;
    const updatedLocation = this.updateUserForm.value.location;
    const updatedBio = this.updateUserForm.value.bio;

    this.authService
      .updateUserProfileInfo(updatedName, updatedLocation, updatedBio)
      .subscribe({
        next: (response) => {
          this.currentUser = {
            ...this.currentUser,
            name: response.name || this.currentUser.name,
            bio: response.bio || this.currentUser.bio,
            location: response.location || this.currentUser.location,
          };

          this.authService.setUserData(this.currentUser);
          this.initializeForm();
        },
        error: (error) => {
          console.log(error.error.message);
        },
      });
  }
}
