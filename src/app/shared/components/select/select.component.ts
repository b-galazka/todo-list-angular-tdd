import { Component } from '@angular/core';

import {
  AbstractReactiveInputComponent
} from '../shared/abstracts/abstract-reactive-input.component';

import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent extends AbstractReactiveInputComponent {
  public constructor(public ngControl: NgControl) {
    super(ngControl);
  }
}
