import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const cpassword = control.get('cpassword');
  console.log('here');

  if (!password || !cpassword) {
    return null;
  }

  const errors: ValidationErrors = {};

  if (password.value.length < 8) {
    errors['passwordMinLength'] = true;
  }

  if (password.value != cpassword.value) {
    errors['passwordMismatch'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
