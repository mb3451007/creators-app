import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-creator-verification',
  templateUrl: './creator-verification.component.html',
  styleUrls: ['./creator-verification.component.scss']
})
export class CreatorVerificationComponent implements OnInit, OnDestroy {

  form: FormGroup;
  alertMessage: string;
  alertType: string;
  showAlert: boolean;
  private subject = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      verificationToken: ['', Validators.required],
    });
  }

  creatorVerificationApproved(): void {
    this.authService.creatorVerificationApproved(this.form.value.verificationToken).pipe(takeUntil(this.subject)).subscribe(response => {
      this.displayAlert('success', response.message)
    }, error => {
      this.displayAlert('danger', error.error.message)
    })
  }

  displayAlert(type: string, message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;
    setTimeout(() => {
      this.router.navigate(['/login']).then();
    }, 2000);
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }
}
