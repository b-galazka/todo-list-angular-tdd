import { Location } from '@angular/common';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { taskMock } from 'src/mocks/data/task.mock';
import { AppTitleServiceMock } from 'src/mocks/services/app-title.service.mock';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ITaskCreationData } from '../../interfaces/task-creation-data.interface';
import { NewTaskComponent } from './new-task.component';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let appTitleService: AppTitleServiceMock;
  let location: Location;
  let tasksService: TasksServiceMock;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    const routes: Routes = [{ path: '**', component: NewTaskComponent }];

    TestBed.configureTestingModule({
      declarations: [
        NewTaskComponent,
        TaskFormComponent,
        TextInputComponent,
        TextareaComponent,
        SelectComponent
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: AppTitleService, useClass: AppTitleServiceMock },
        { provide: TasksService, useClass: TasksServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    appTitleService = TestBed.get(AppTitleService);
    location = TestBed.get(Location);
    tasksService = TestBed.get(TasksService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on init', () => {
    const spy = spyOn(appTitleService, 'setPageTitle');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith('new task');
  });

  it('should navigate to tasks list on tasks list link click', fakeAsync(() => {
    const linkElem: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-test-id="tasks-list-link"]')
    ).nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/1');
  }));

  it('should create task on form submit', () => {
    const observable = of(taskMock);
    const spy = spyOn(tasksService, 'createTask').and.returnValue(observable);
    const subSpy = spyOn(observable, 'subscribe');
    const taskData: ITaskCreationData = { name: 'task name', description: 'task desc' };
    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));

    taskFormComponentElem.triggerEventHandler('submitted', taskData);

    expect(spy).toHaveBeenCalledWith(taskData);
    expect(subSpy).toHaveBeenCalled();
  });

  it('should mark form as pending when creating new task', () => {
    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const taskFormComponent: TaskFormComponent = taskFormComponentElem.componentInstance;

    taskFormComponentElem.triggerEventHandler('submitted', {});
    fixture.detectChanges();

    expect(taskFormComponent.pending).toBe(true);
  });

  it('should redirect to created task details', fakeAsync(() => {
    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));

    spyOn(tasksService, 'createTask').and.returnValue(of(taskMock));
    taskFormComponentElem.triggerEventHandler('submitted', {});

    tick();

    expect(location.path()).toBe(`/tasks/details/${taskMock.id}`);
  }));

  it('should mark form as pristine on task creation success', fakeAsync(() => {
    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const form: FormGroup = taskFormComponentElem.componentInstance.form;
    const spy = spyOn(form, 'markAsPristine');

    spyOn(tasksService, 'createTask').and.returnValue(of(taskMock));
    taskFormComponentElem.triggerEventHandler('submitted', {});
    tick();

    expect(spy).toHaveBeenCalled();
  }));

  it('should unmark task form as pending on request failure', () => {
    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const taskFormComponent: TaskFormComponent = taskFormComponentElem.componentInstance;

    spyOn(tasksService, 'createTask').and.returnValue(throwError(new Error()));
    taskFormComponentElem.triggerEventHandler('submitted', {});

    expect(taskFormComponent.pending).toBe(false);
  });

  describe('#canBeDeactivated', () => {
    let windowConfirmSpy: jasmine.Spy;

    beforeEach(() => {
      windowConfirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    });

    it('should return true if form is pristine', () => {
      const taskFormComponent: TaskFormComponent = debugElement.query(By.css('app-task-form'))
        .componentInstance;

      taskFormComponent.form.markAsPristine();

      expect(component.canBeDeactivated()).toBe(true);
    });

    it('should return true if form is dirty and users confirmes', () => {
      const taskFormComponent: TaskFormComponent = debugElement.query(By.css('app-task-form'))
        .componentInstance;

      taskFormComponent.form.markAsDirty();

      expect(component.canBeDeactivated()).toBe(true);
    });

    it('should return false if form is dirty and users declines', () => {
      const taskFormComponent: TaskFormComponent = debugElement.query(By.css('app-task-form'))
        .componentInstance;

      taskFormComponent.form.markAsDirty();
      windowConfirmSpy.and.returnValue(false);

      expect(component.canBeDeactivated()).toBe(false);
    });

    it('should be called on window:beforeunload', () => {
      const spy = spyOn(component, 'canBeDeactivated');

      window.dispatchEvent(new Event('beforeunload'));

      expect(spy).toHaveBeenCalled();
    });
  });
});
