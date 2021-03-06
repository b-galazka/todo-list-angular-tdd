import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectComponent } from './select.component';

@Component({
  selector: 'app-select-wrapper-component',
  template: `
    <ng-container [formGroup]="form">
      <app-select formControlName="status">
        <option *ngFor="let option of options" [value]="option.value">{{ option.label }}</option>
      </app-select>
    </ng-container>
  `
})
class SelectWrapperComponent {
  public readonly form = new FormGroup({
    status: new FormControl()
  });

  public readonly options = [
    { value: 'lorem', label: 'Lorem' },
    { value: 'test', label: 'Test' },
    { value: 'some-text', label: 'Some Text' }
  ];
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let wrapperComponent: SelectWrapperComponent;
  let fixture: ComponentFixture<SelectWrapperComponent>;
  let formControl: FormControl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent, SelectWrapperComponent],
      imports: [ReactiveFormsModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWrapperComponent);
    component = fixture.debugElement.query(By.css('app-select')).componentInstance;
    wrapperComponent = fixture.componentInstance;
    formControl = <FormControl>wrapperComponent.form.get('status');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ng-content as possible options', () => {
    const optionsElems: Array<HTMLOptionElement> = fixture.debugElement
      .queryAll(By.css('option'))
      .map(optionElem => optionElem.nativeElement);

    expect(optionsElems.length).toBe(wrapperComponent.options.length);

    optionsElems.forEach((optionElem, index) => {
      const option = wrapperComponent.options[index];

      expect(optionElem.value).toBe(option.value);
      expect(optionElem.textContent).toBe(option.label);
    });
  });

  it('should set select value of form control value', fakeAsync(() => {
    const selectValue = wrapperComponent.options[1].value;

    formControl.setValue(selectValue);
    formControl.updateValueAndValidity();

    fixture.detectChanges();
    tick();

    const selectElem: HTMLSelectElement = fixture.debugElement.query(By.css('.field'))
      .nativeElement;

    expect(selectElem.value).toBe(selectValue);
  }));

  it('should update control value on value change', fakeAsync(() => {
    const selectedValue = wrapperComponent.options[1].value;

    const selectElem: HTMLSelectElement = fixture.debugElement.query(By.css('.field'))
      .nativeElement;

    selectElem.value = selectedValue;
    selectElem.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    tick();

    expect(formControl.value).toBe(selectedValue);
  }));

  it('should call #handleTouch() on select blur', () => {
    const spy = spyOn(component, 'handleTouch');
    const selectElem = fixture.debugElement.query(By.css('.field'));

    selectElem.triggerEventHandler('blur', new FocusEvent('blur'));

    expect(spy).toHaveBeenCalled();
  });
});
