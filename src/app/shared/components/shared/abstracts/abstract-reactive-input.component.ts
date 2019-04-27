import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';

export type IReactiveInputChangeHandler = (newValue: string) => void;
export type IReactiveInputTouchHandler = () => void;

export abstract class AbstractReactiveInputComponent implements ControlValueAccessor {

  @Input() public label = '';

  public value: string;
  public handleChange: IReactiveInputChangeHandler;
  public handleTouch: IReactiveInputTouchHandler;

  public constructor(public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  public writeValue(newValue: string): void {
    this.value = newValue;
  }

  public registerOnChange(fn: IReactiveInputChangeHandler): void {
    this.handleChange = fn;
  }

  public registerOnTouched(fn: IReactiveInputTouchHandler): void {
    this.handleTouch = fn;
  }
}
