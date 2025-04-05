import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})

export class CreatorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  files = [];
  user: User = null;
  alertMessage: string;
  alertType: string;
  showAlert: boolean;
  private subject = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.createForm();

    this.user  = this.authService.getUserData;

    if (this.user && this.user.attachmentsForCreator && this.user.attachmentsForCreator.length > 0) {
      this.user.attachmentsForCreator.forEach((attachment, index) => {
        this.getFiles().at(index).patchValue({name: attachment.originalName, size: attachment.size});
      });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      files: this.formBuilder.array([
        new FormControl(null, [Validators.required]),
        new FormControl(null, [Validators.required]),
        new FormControl(null, [Validators.required]),
        new FormControl(null, [Validators.required])
      ])
    });
  }

  getFiles() {
    return this.form.get('files') as FormArray;
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.getFiles().at(index).patchValue(file);
    }

    event.target.value = null;
  }

  deleteAttachment(index: number): void {
    this.getFiles().at(index).patchValue(null);
  }

  saveFiles() {
    const formData = new FormData();
    this.getFiles().controls.forEach((control: FormControl, index: number) => {
      formData.append(`file${index + 1}`, control.value, control.value.name);
    });

    this.authService.requestForCreator(this.user._id, formData).pipe(takeUntil(this.subject)).subscribe(response => {
      this.updateUserData(this.user._id);
    }, error => {
      console.log(error);
    });
  }

  updateUserData(id: string): void {
    if (!id) {
      return;
    }

    this.authService.getSingleUser(this.user._id).pipe(takeUntil(this.subject)).subscribe(response => {
      this.authService.setUserData(response);
      this.user = this.authService.getUserData;
    })
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }
}
