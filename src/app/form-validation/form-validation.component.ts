import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss'],
})
export class FormValidationComponent {
  @Input() control: AbstractControl;
  @Input() fieldName: string;
  @Input() min?: number;
  @Input() max?: number;
}
