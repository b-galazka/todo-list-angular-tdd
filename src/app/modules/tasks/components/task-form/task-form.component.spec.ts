import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  Validators
} from '@angular/forms';

import { TaskFormComponent } from './task-form.component';
import { TaskStatus } from 'src/app/core/models/task.model';
import { taskMock } from 'src/mocks/data/task.mock';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';


describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let debugElement: DebugElement;
  let formControls: Array<FormControl>;

  function initValues(): void {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskFormComponent, TextInputComponent, TextareaComponent, SelectComponent],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    initValues();
    fixture.detectChanges();
    formControls = <Array<FormControl>> Object.values(component.form.controls);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it('should submit form on button click', () => {

    component.form.setValue({ name: 'X', description: 'X', status: 'new' });

    const spy = spyOn(component.submitted, 'emit');

    const buttonElem: HTMLButtonElement = debugElement
      .query(By.css('.submit-button')).nativeElement;

    buttonElem.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.form.value);
  });

  it('should mark each field as touched on submit', () => {

    const spies = formControls.map(control => spyOn(control, 'markAsTouched'));

    const buttonElem: HTMLButtonElement = debugElement
      .query(By.css('.submit-button')).nativeElement;

    buttonElem.click();

    spies.forEach(spy => expect(spy).toHaveBeenCalled());
  });

  it('should validate each field on submit', () => {

    const spies = formControls.map(control => spyOn(control, 'updateValueAndValidity'));

    const buttonElem: HTMLButtonElement = debugElement
      .query(By.css('.submit-button')).nativeElement;

    buttonElem.click();

    spies.forEach(spy => expect(spy).toHaveBeenCalled());
  });

  it('should set each field as required', () => {

    component.form.reset();
    formControls.forEach(control => control.updateValueAndValidity());

    formControls.forEach(control => expect(control.hasError('required')).toBe(true));
  });

  it('should set max length validator to 120 characters for name field', () => {

    const nameFormControl = component.form.get('name');

    nameFormControl.setValue('X'.repeat(121));
    nameFormControl.updateValueAndValidity();

    expect(nameFormControl.getError('maxlength')).toEqual({
      requiredLength: 120,
      actualLength: 121
    });
  });

  it('should not submit form on button click if form is invalid', () => {

    const spy = spyOn(component.submitted, 'emit');

    const buttonElem: HTMLButtonElement = debugElement
      .query(By.css('.submit-button')).nativeElement;

    component.form.reset();
    component.form.get('name').setValidators(Validators.required);

    buttonElem.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should disable submit button if form is pending', () => {

    initValues();
    component.pending = true;
    fixture.detectChanges();

    const buttonElem: HTMLButtonElement = debugElement
      .query(By.css('.submit-button')).nativeElement;

    expect(buttonElem.disabled).toBe(true);
  });

  describe('Creation mode', () => {
    it('should initialize form with initial values', () => {
      expect(component.form.value).toEqual({
        name: null,
        description: null,
        status: TaskStatus.New
      });
    });

    it('should render button to add new task', () => {

      const buttonTextElem = debugElement.query(By.css('.submit-button .new-task-button-text'));

      expect(buttonTextElem).toBeTruthy();
    });
  });

  describe('Edition mode', () => {
    beforeEach(() => {
      initValues();
      component.existingTask = taskMock;
      fixture.detectChanges();
    });

    it('should initialize form with values of provided task', () => {
      expect(component.form.value).toEqual({
        name: taskMock.name,
        description: taskMock.description,
        status: taskMock.status
      });
    });

    it('should disable submit button if form is pristine', () => {

      const buttonElem: HTMLButtonElement = debugElement
        .query(By.css('.submit-button')).nativeElement;

      expect(buttonElem.disabled).toBe(true);
    });

    it('should render button to update existing task', () => {

      const buttonTextElem = debugElement.query(By.css('.submit-button .update-task-button-text'));

      expect(buttonTextElem).toBeTruthy();
    });
  });
});
