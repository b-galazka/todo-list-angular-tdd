import { Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export class AbstractInputComponent {
  @Input() public formCtrl: FormControl;
  @Input() public placeholder = '';
}
