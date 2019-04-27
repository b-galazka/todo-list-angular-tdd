import { Component, Input } from '@angular/core';

import {
  AbstractReactiveInputComponent
} from '../shared/abstracts/abstract-reactive-input.component';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['../shared/styles/text-input.scss', './textarea.component.scss']
})
export class TextareaComponent extends AbstractReactiveInputComponent {
  @Input() public rows = 10;
  @Input() public placeholder = '';

  public constructor(public ngControl: NgControl) {
    super(ngControl);
  }
}
