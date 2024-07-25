import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { projecTitle } from 'src/app/constants';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  titleName = projecTitle;
  profileForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  bannerUrl: string | ArrayBuffer | null = null;


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
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

  onbannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileForm.patchValue({
        profileImage: file
      });
      this.profileForm.get('profileImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.bannerUrl = reader.result;
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
  }
}
