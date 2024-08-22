import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const updateFormValidator = (currentUser: any): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.get('name');
    const location = control.get('location');
    const bio = control.get('bio');
    console.log(
      ' Name: ' +
        name.value +
        ' Location: ' +
        location.value +
        ' Bio: ' +
        bio.value
    );

    const isNameNotChanged = name.value === currentUser.name;
    const isBioNotChanged = bio.value === currentUser.bio;
    const isLocationNotChanged = location.value === currentUser.location;

    const errors: ValidationErrors = {};
    if (!name.value || !location.value || !bio.value) {
      errors['fieldsEmpty'] = true;
    }

    if (isNameNotChanged && isBioNotChanged && isLocationNotChanged) {
      errors['nothingToUpdate'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
};
