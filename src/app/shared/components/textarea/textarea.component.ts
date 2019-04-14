import { Component, Input } from '@angular/core';
import { AbstractInputComponent } from '../shared/abstracts/abstract-input.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['../shared/styles/text-input.scss', './textarea.component.scss']
})
export class TextareaComponent extends AbstractInputComponent {
  @Input() public rows = 10;
}
