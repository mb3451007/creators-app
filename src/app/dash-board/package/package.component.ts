import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { env } from 'src/app/environments/env.development';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
})
export class PackageComponent implements OnInit {
  packageForm: FormGroup;
  package: any;
  currentUser: any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Get current user data from the AuthService
    this.currentUser = this.authService.getUserData;

    // Initialize form with validators
    this.packageForm = this.fb.group({
      packageName: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      priceAmount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.getPackage();
  }
  // Handle form submission
  onSubmit() {
    this.isLoading = true;
    if (this.package) {
      alert('You already have a package created, please delete it first!');
      this.isLoading = false;
      return;
    }
    if (this.packageForm.valid) {
      const formData = {
        userId: this.currentUser._id,
        currency: 'usd', // Add current user's ID
        ...this.packageForm.value, // Add form values
      };

      // Post the form data to the API
      this.http
        .post(`${env.baseURL}/stripe/create-package`, formData)
        .subscribe(
          (response: any) => {
            console.log('Package created successfully:', response);
            this.package = response.newPackage;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error creating package:', error);
            this.isLoading = false;
          }
        );
    } else {
      this.isLoading = false;
      console.error('Form is invalid!');
    }
  }

  getPackage() {
    this.isLoading = true;
    this.http
      .get(`${env.baseURL}/stripe/packages/${this.currentUser._id}`)
      .subscribe(
        (response: any) => {
          console.log(response, '----------------this is the package');
          this.package = response.package[0];
          this.isLoading = false;
        },
        (error) => {
          console.error('Error creating package:', error);
          this.isLoading = false;
        }
      );
  }
  deletePackage(packageID: string) {
    this.isLoading = true;
    this.http
      .delete(`${env.baseURL}/stripe/delete-package/${packageID}`)
      .subscribe(
        (response) => {
          console.log(response);
          this.package = null;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error creating package:', error);
          this.isLoading = false;
        }
      );
  }
}
