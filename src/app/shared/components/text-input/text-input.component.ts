import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractInputComponent } from '../shared/abstracts/abstract-input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['../shared/styles/text-input.scss', './text-input.component.scss']
})
export class TextInputComponent extends AbstractInputComponent {
  @Input() public type = 'text';
}
