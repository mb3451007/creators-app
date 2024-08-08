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

    const isNameNotChanged = name.value.trim() === currentUser.name.trim();
    const isBioNotChanged = bio.value.trim() === currentUser.bio.trim();
    const isLocationNotChanged =
      location.value.trim() === currentUser.location.trim();

    const errors: ValidationErrors = {};
    if (!name.value.trim() || !location.value.trim() || !bio.value.trim()) {
      errors['fieldsEmpty'] = true;
    }

    if (isNameNotChanged && isBioNotChanged && isLocationNotChanged) {
      errors['nothingToUpdate'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
};
