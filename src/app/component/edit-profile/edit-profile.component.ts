import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  
  profileForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      profileImage: [null]
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileForm.patchValue({
        profileImage: file
      });
      this.profileForm.get('profileImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
