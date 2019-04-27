import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';

export type IReactiveFormFieldChangeHandler = (newValue: string) => void;
export type IReactiveFormFieldTouchHandler = () => void;

export abstract class AbstractReactiveFormFieldComponent implements ControlValueAccessor {

  @Input() public label = '';

  public value: string;
  public handleChange: IReactiveFormFieldChangeHandler;
  public handleTouch: IReactiveFormFieldTouchHandler;

  public constructor(public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  public writeValue(newValue: string): void {
    this.value = newValue;
  }

  public registerOnChange(fn: IReactiveFormFieldChangeHandler): void {
    this.handleChange = fn;
  }

  public registerOnTouched(fn: IReactiveFormFieldTouchHandler): void {
    this.handleTouch = fn;
  }
}
