import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { of, throwError } from 'rxjs';

import { EditTaskComponent } from './edit-task.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { AppTitleServiceMock } from 'src/mocks/services/app-title.service.mock';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { taskMock } from 'src/mocks/data/task.mock';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { ITaskCreationData } from 'src/app/core/models/task.model';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;
  let debugElement: DebugElement;
  let appTitleService: AppTitleServiceMock;
  let tasksService: TasksServiceMock;
  let location: Location;

  const params: Record<string, any> = {
    taskId: taskMock.id
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get(param: string): any {
          return params[param];
        }
      }
    }
  };

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: EditTaskComponent }
    ];

    TestBed.configureTestingModule({
      declarations: [
        EditTaskComponent,
        TaskFormComponent,
        TextInputComponent,
        TextareaComponent,
        SelectComponent
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: AppTitleService, useClass: AppTitleServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TasksService, useClass: TasksServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    appTitleService = TestBed.get(AppTitleService);
    tasksService = TestBed.get(TasksService);
    location = TestBed.get(Location);

    tasksService.setState({
      currentTaskFetchingStatus: RequestStatus.Success,
      currentTask: taskMock
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial page title on init', () => {

    const spy = spyOn(appTitleService, 'setPageTitle');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith('edit task');
  });

  it('should set detailed page title when task is fetched', () => {

    const spy = spyOn(appTitleService, 'setPageTitle');
    const taskObservable = of(taskMock);

    spyOn(tasksService, 'getTask').and.callFake(
      (taskId: number) => taskId === taskMock.id ? taskObservable : null
    );

    component.ngOnInit();

    taskObservable.subscribe((task) => {
      expect(spy).toHaveBeenCalledWith(`edit "${taskMock.name}" task`);
    });
  });

  it('should display loader if task is being fetched', () => {

    tasksService.setState({ currentTaskFetchingStatus: RequestStatus.Pending });

    fixture.detectChanges();

    const loaderElem = debugElement.query(By.css('.loader'));

    expect(loaderElem).toBeTruthy();
  });

  it('should not display loader if task is not being fetched', () => {

    const loaderElem = debugElement.query(By.css('.loader'));

    expect(loaderElem).toBeFalsy();
  });

  it('should display "not found" message if task has not been found', () => {

    tasksService.setState({ currentTaskFetchingStatus: RequestStatus.NotFound });

    fixture.detectChanges();

    const notFoundMsgElem = debugElement.query(By.css('.not-found-msg'));

    expect(notFoundMsgElem).toBeTruthy();
  });

  it('should not display "not found" message if task has been found', () => {

    const notFoundMsgElem = debugElement.query(By.css('.not-found-msg'));

    expect(notFoundMsgElem).toBeFalsy();
  });

  it('should display fetching error if unknown error has occured', () => {

    tasksService.setState({ currentTaskFetchingStatus: RequestStatus.Error });

    fixture.detectChanges();

    const fetchingErrorElem = debugElement.query(By.css('.fetching-error'));

    expect(fetchingErrorElem).toBeTruthy();
  });

  it('should not display fetching error if task has been fetched', () => {

    const fetchingErrorElem = debugElement.query(By.css('.fetching-error'));

    expect(fetchingErrorElem).toBeFalsy();
  });

  it('should navigate to task details on task details link click', fakeAsync(() => {

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.task-details-link'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe(`/tasks/details/${taskMock.id}`);
  }));

  it('should provide task to task form', () => {

    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const taskFormComponent: TaskFormComponent = taskFormComponentElem.componentInstance;

    expect(taskFormComponent.existingTask).toBe(taskMock);
  });

  it('should update task on form submit', () => {

    const observable = of(taskMock);
    const spy = spyOn(tasksService, 'patchTask').and.returnValue(observable);
    const subSpy = spyOn(observable, 'subscribe');
    const taskData: ITaskCreationData = { name: 'task name', description: 'task desc' };
    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));

    taskFormComponentElem.triggerEventHandler('submitted', taskData);

    expect(spy).toHaveBeenCalledWith(taskData, taskMock.id);
    expect(subSpy).toHaveBeenCalled();
  });

  it('should mark form as pending when updating task', () => {

    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const taskFormComponent: TaskFormComponent = taskFormComponentElem.componentInstance;

    taskFormComponentElem.triggerEventHandler('submitted', {});
    fixture.detectChanges();

    expect(taskFormComponent.pending).toBe(true);
  });

  it('should redirect to updated task details', fakeAsync(() => {

    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));

    spyOn(tasksService, 'patchTask').and.returnValue(of(taskMock));
    taskFormComponentElem.triggerEventHandler('submitted', {});

    tick();

    expect(location.path()).toBe(`/tasks/details/${taskMock.id}`);
  }));

  it('should mark form as pristine on task creation success', fakeAsync(() => {

    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const form: FormGroup = taskFormComponentElem.componentInstance.form;
    const spy = spyOn(form, 'markAsPristine');

    spyOn(tasksService, 'patchTask').and.returnValue(of(taskMock));
    taskFormComponentElem.triggerEventHandler('submitted', {});
    tick();

    expect(spy).toHaveBeenCalled();
  }));

  it('should unmark task form as pending on request failure', () => {

    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const taskFormComponent: TaskFormComponent = taskFormComponentElem.componentInstance;

    spyOn(tasksService, 'patchTask').and.returnValue(throwError(new Error()));
    taskFormComponentElem.triggerEventHandler('submitted', {});

    expect(taskFormComponent.pending).toBe(false);
  });

  describe('#canBeDeactivated', () => {

    let windowConfirmSpy: jasmine.Spy;

    beforeEach(() => {
      windowConfirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    });

    it('should return true if form is pristine', () => {

      const taskFormComponent: TaskFormComponent = debugElement
        .query(By.css('app-task-form')).componentInstance;

      taskFormComponent.form.markAsPristine();

      expect(component.canBeDeactivated()).toBe(true);
    });

    it('should return true if form is dirty and users confirmes', () => {

      const taskFormComponent: TaskFormComponent = debugElement
        .query(By.css('app-task-form')).componentInstance;

      taskFormComponent.form.markAsDirty();

      expect(component.canBeDeactivated()).toBe(true);
    });

    it('should return false if form is dirty and users declines', () => {

      const taskFormComponent: TaskFormComponent = debugElement
        .query(By.css('app-task-form')).componentInstance;

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
