import { Component, Input } from '@angular/core';

import {
  AbstractReactiveInputComponent
} from '../shared/abstracts/abstract-reactive-input.component';

import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['../shared/styles/text-input.scss', './text-input.component.scss']
})
export class TextInputComponent extends AbstractReactiveInputComponent {
  @Input() public type = 'text';

  public constructor(public ngControl: NgControl) {
    super(ngControl);
  }
}
