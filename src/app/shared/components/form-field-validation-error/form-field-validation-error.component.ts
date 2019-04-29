import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-field-validation-error',
  templateUrl: './form-field-validation-error.component.html',
  styleUrls: ['./form-field-validation-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldValidationErrorComponent {
  @Input() public errors: ValidationErrors;

  public get errorType(): string {
    return Object.keys(this.errors)[0];
  }

  public get errorDetails(): any {
    return this.errors[this.errorType];
  }
}
