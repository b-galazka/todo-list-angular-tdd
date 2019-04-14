import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { By } from '@angular/platform-browser';

import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormControlDirective,
  Validators
} from '@angular/forms';
import { Component } from '@angular/core';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;
  let form: FormGroup;

  beforeEach(async(() => {

    form = new FormGroup({
      description: new FormControl()
    });

    TestBed.configureTestingModule({
      declarations: [TextareaComponent],
      imports: [ReactiveFormsModule],
      providers: [FormControlDirective]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    component.formCtrl = <FormControl> form.get('description');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render textarea', () => {

    const textAreaElem: HTMLTextAreaElement = fixture.debugElement
      .query(By.css('.text-field')).nativeElement;

    expect(textAreaElem.type).toBe('textarea');
  });

  it('should render input with empty placeholder by default', () => {

    const textAreaElem: HTMLTextAreaElement = fixture.debugElement
      .query(By.css('.text-field')).nativeElement;

    expect(textAreaElem.placeholder).toBe('');
  });

  it('should render textarea with provided placeholder', () => {

    const placeholder = 'some text';

    component.placeholder = placeholder;

    fixture.detectChanges();

    const textAreaElem: HTMLTextAreaElement = fixture.debugElement
      .query(By.css('.text-field')).nativeElement;

    expect(textAreaElem.placeholder).toBe(placeholder);
  });

  it('should render input with 10 rows by default', () => {

    const textAreaElem: HTMLTextAreaElement = fixture.debugElement
      .query(By.css('.text-field')).nativeElement;

    expect(textAreaElem.rows).toBe(10);
  });

  it('should render textarea with provided amount of rows', () => {

    const rowsAmount = 30;

    component.rows = rowsAmount;

    fixture.detectChanges();

    const textAreaElem: HTMLTextAreaElement = fixture.debugElement
      .query(By.css('.text-field')).nativeElement;

    expect(textAreaElem.rows).toBe(rowsAmount);
  });

  it('should connect textarea with provided form control', () => {

    const textAreaElem = fixture.debugElement.query(By.css('.text-field'));
    const fromControlDirective = textAreaElem.injector.get(FormControlDirective);

    expect(fromControlDirective.form).toBe(<FormControl> form.get('description'));
  });

  it('should render "required" validation error if textarea is touched', () => {

    const formControl = form.get('description');

    formControl.setValidators(Validators.required);
    formControl.setValue('');
    formControl.updateValueAndValidity();
    formControl.markAsTouched();

    fixture.detectChanges();

    const validationErrorElem = fixture.debugElement.query(By.css('.required-error'));

    expect(validationErrorElem).toBeTruthy();
  });
});

describe('TextareaComponent', () => {

  @Component({
    selector: 'app-test-wrapper',
    template: `
    <app-textarea [formCtrl]="form.get('description')">
      <p class="really-rare-label-css-class-name">Description</p>
    </app-textarea>
  `
  })
  class TestWrapperComponent {
    public readonly form = new FormGroup({
      description: new FormControl()
    });
  }

  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [TestWrapperComponent, TextareaComponent],
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
      .query(By.css('app-textarea .label .really-rare-label-css-class-name'))
      .nativeElement;

    expect(labelElem.textContent).toBe('Description');
  });
});
