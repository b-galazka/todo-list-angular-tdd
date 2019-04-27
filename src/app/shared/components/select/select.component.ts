import { Component } from '@angular/core';

import {
  AbstractReactiveFormFieldComponent
} from '../shared/abstracts/abstract-reactive-form-field.component';

import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['../shared/styles/form-field.scss', './select.component.scss']
})
export class SelectComponent extends AbstractReactiveFormFieldComponent {
  public constructor(public ngControl: NgControl) {
    super(ngControl);
  }
}
