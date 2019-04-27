import { Component, Input } from '@angular/core';

import {
  AbstractReactiveFormFieldComponent
} from '../shared/abstracts/abstract-reactive-form-field.component';

import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['../shared/styles/form-field.scss', './text-input.component.scss']
})
export class TextInputComponent extends AbstractReactiveFormFieldComponent {
  @Input() public type = 'text';
  @Input() public placeholder = '';

  public constructor(public ngControl: NgControl) {
    super(ngControl);
  }
}
