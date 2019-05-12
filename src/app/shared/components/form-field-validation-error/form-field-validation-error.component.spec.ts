import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormFieldValidationErrorComponent } from './form-field-validation-error.component';

describe('FormFieldValidationErrorComponent', () => {
  let component: FormFieldValidationErrorComponent;
  let fixture: ComponentFixture<FormFieldValidationErrorComponent>;

  function initValues(): void {
    fixture = TestBed.createComponent(FormFieldValidationErrorComponent);
    component = fixture.componentInstance;
    component.errors = {};
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldValidationErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    initValues();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render required error', () => {

    initValues();
    component.errors = { required: true };
    fixture.detectChanges();

    const requiredErrorElem = fixture.debugElement.query(By.css('[data-test-id="required-error"]'));

    expect(requiredErrorElem).toBeTruthy();
  });

  it('should render max length error', () => {

    initValues();
    component.errors = { maxlength: { actualLength: 121, requiredLength: 120 } };
    fixture.detectChanges();

    const maxLengthErrorElem = fixture.debugElement.query(
      By.css('[data-test-id="max-length-error"]')
    );

    expect(maxLengthErrorElem).toBeTruthy();
  });

  it('should render only one error at the same time', () => {

    initValues();
    component.errors = { maxlength: { actualLength: 121, requiredLength: 120 }, required: true };
    fixture.detectChanges();

    const errorElem = fixture.debugElement.query(By.css('.validation-error'));

    expect(errorElem.children.length).toBe(1);
  });

  it('should not render error if it does not exist', () => {

    initValues();
    component.errors = {};
    fixture.detectChanges();

    const validationError = fixture.debugElement.query(By.css('.validation-error'));

    expect(validationError).toBeFalsy();
  });
});
