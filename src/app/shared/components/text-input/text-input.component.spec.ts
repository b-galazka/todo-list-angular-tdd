import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import { By } from '@angular/platform-browser';

import {
  FormGroup,
  FormControl,
  FormControlDirective,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Component } from '@angular/core';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;
  let form: FormGroup;

  beforeEach(async(() => {

    form = new FormGroup({
      name: new FormControl()
    });

    TestBed.configureTestingModule({
      declarations: [TextInputComponent],
      imports: [ReactiveFormsModule],
      providers: [FormControlDirective]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    component.formCtrl = <FormControl> form.get('name');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input of type text by default', () => {

    const inputElem: HTMLInputElement = fixture.debugElement.query(By.css('.input')).nativeElement;

    expect(inputElem.type).toBe('text');
  });

  it('should render input of provided type', () => {

    const inputType = 'email';

    component.type = inputType;

    fixture.detectChanges();

    const inputElem: HTMLInputElement = fixture.debugElement.query(By.css('.input')).nativeElement;

    expect(inputElem.type).toBe(inputType);
  });

  it('should render input with empty placeholder by default', () => {

    const inputElem: HTMLInputElement = fixture.debugElement.query(By.css('.input')).nativeElement;

    expect(inputElem.placeholder).toBe('');
  });

  it('should render input with provided placeholder', () => {

    const placeholder = 'some text';

    component.placeholder = placeholder;

    fixture.detectChanges();

    const inputElem: HTMLInputElement = fixture.debugElement.query(By.css('.input')).nativeElement;

    expect(inputElem.placeholder).toBe(placeholder);
  });

  it('should connect input with provided form control', () => {

    const inputElem = fixture.debugElement.query(By.css('.input'));
    const fromControlDirective = inputElem.injector.get(FormControlDirective);

    expect(fromControlDirective.form).toBe(<FormControl> form.get('name'));
  });

  it('should render "required" validation error if input is touched', () => {

    const formControl = form.get('name');

    formControl.setValidators(Validators.required);
    formControl.setValue('');
    formControl.updateValueAndValidity();
    formControl.markAsTouched();

    fixture.detectChanges();

    const validationErrorElem = fixture.debugElement.query(By.css('.required-error'));

    expect(validationErrorElem).toBeTruthy();
  });
});

describe('TextInputComponent', () => {

  @Component({
    selector: 'app-test-wrapper',
    template: `
    <app-text-input [formCtrl]="form.get('name')">
      <p class="really-rare-label-css-class-name">Name</p>
    </app-text-input>
  `
  })
  class TestWrapperComponent {
    public readonly form = new FormGroup({
      name: new FormControl()
    });
  }

  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, TextInputComponent],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
  });

  it('should render provided label', () => {

    const labelElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('app-text-input .label .really-rare-label-css-class-name'))
      .nativeElement;

    expect(labelElem.textContent).toBe('Name');
  });
});
