import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewTaskComponent } from './new-task.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AppTitleServiceMock } from 'src/mocks/services/app-title.service.mock';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { TasksService } from 'src/app/core/services/tasks.service';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { ITaskCreationData } from 'src/app/core/models/task.model';
import { taskMock } from 'src/mocks/data/task.mock';
import { of, throwError } from 'rxjs';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let appTitleService: AppTitleServiceMock;
  let location: Location;
  let tasksService: TasksServiceMock;
  let debugElement: DebugElement;

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: NewTaskComponent }
    ];

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
    })
    .compileComponents();
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

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.tasks-list-link'))
      .nativeElement;

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

  it('should unmark task form as pending on request failure', () => {

    const taskFormComponentElem = debugElement.query(By.css('app-task-form'));
    const taskFormComponent: TaskFormComponent = taskFormComponentElem.componentInstance;

    spyOn(tasksService, 'createTask').and.returnValue(throwError(new Error()));
    taskFormComponentElem.triggerEventHandler('submitted', {});

    expect(taskFormComponent.pending).toBe(false);
  });

  // TODO: canDeactivate guard and popup onbeforeunload if form is dirty
});
