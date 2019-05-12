import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { TaskDetailsComponent } from './task-details.component';
import { Routes, ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AppTitleServiceMock } from 'src/mocks/services/app-title.service.mock';
import { taskMock } from 'src/mocks/data/task.mock';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { TaskStatusComponent } from '../../components/task-status/task-status.component';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let location: Location;
  let tasksService: TasksServiceMock;
  let appTitleService: AppTitleService;

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

  function stringifyTaskDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:` +
      `${date.getMinutes()}`;
  }

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: TaskDetailsComponent }
    ];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [TaskDetailsComponent, TaskStatusComponent],
      providers: [
        { provide: TasksService, useClass: TasksServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AppTitleService, useClass: AppTitleServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsComponent);
    location = TestBed.get(Location);
    tasksService = TestBed.get(TasksService);
    appTitleService = TestBed.get(AppTitleService);
    component = fixture.componentInstance;

    tasksService.setState({
      currentTaskFetchingStatus: RequestStatus.Success,
      currentTask: taskMock
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch sepcific task on init', () => {

    const observable = of();
    const subSpy = spyOn(observable, 'subscribe');
    const getTaskSpy = spyOn(tasksService, 'getTask').and.returnValue(observable);

    component.ngOnInit();

    expect(getTaskSpy).toHaveBeenCalledWith(params.taskId);
    expect(subSpy).toHaveBeenCalled();
  });

  it('should set initial page title on init', () => {

    const spy = spyOn(appTitleService, 'setPageTitle');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith('task details');
  });

  it('should set detailed page title when task is fetched', () => {

    const spy = spyOn(appTitleService, 'setPageTitle');
    const taskObservable = of(taskMock);

    spyOn(tasksService, 'getTask').and.callFake(
      (taskId: number) => taskId === taskMock.id ? taskObservable : null
    );

    component.ngOnInit();

    taskObservable.subscribe((task) => {
      expect(spy).toHaveBeenCalledWith(`details of "${taskMock.name}"`);
    });
  });

  it('should navigate to tasks list on tasks list link click', fakeAsync(() => {

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('[data-test-id="tasks-list-link"]'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/1');
  }));

  it('should display loader if task is being fetched', () => {

    tasksService.setState({ currentTaskFetchingStatus: RequestStatus.Pending });

    fixture.detectChanges();

    const loaderElem = fixture.debugElement.query(By.css('.loader'));

    expect(loaderElem).toBeTruthy();
  });

  it('should not display loader if task is not being fetched', () => {

    const loaderElem = fixture.debugElement.query(By.css('.loader'));

    expect(loaderElem).toBeFalsy();
  });

  it('should display "not found" message if task has not been found', () => {

    tasksService.setState({ currentTaskFetchingStatus: RequestStatus.NotFound });

    fixture.detectChanges();

    const notFoundMsgElem = fixture.debugElement.query(By.css('[data-test-id="not-found-msg"]'));

    expect(notFoundMsgElem).toBeTruthy();
  });

  it('should not display "not found" message if task has been found', () => {

    const notFoundMsgElem = fixture.debugElement.query(By.css('[data-test-id="not-found-msg"]'));

    expect(notFoundMsgElem).toBeFalsy();
  });

  it('should display fetching error if unknown error has occured', () => {

    tasksService.setState({ currentTaskFetchingStatus: RequestStatus.Error });

    fixture.detectChanges();

    const fetchingErrorElem = fixture.debugElement.query(By.css('[data-test-id="fetching-error"]'));

    expect(fetchingErrorElem).toBeTruthy();
  });

  it('should not display fetching error if task has been fetched', () => {
    const fetchingErrorElem = fixture.debugElement.query(By.css('[data-test-id="fetching-error"]'));
    expect(fetchingErrorElem).toBeFalsy();
  });

  it('should display task name', () => {

    const taskNameElem: HTMLHeadingElement = fixture.debugElement
      .query(By.css('[data-test-id="task-name"]'))
      .nativeElement;

    expect(taskNameElem.textContent).toBe(taskMock.name);
  });

  it('should display task description', () => {

    const taskDescElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-desc'))
      .nativeElement;

    expect(taskDescElem.textContent).toBe(taskMock.description);
  });

  it('should display task creation date', () => {

    const taskCreationDateElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('[data-test-id="task-creation-date"]'))
      .nativeElement;

    const taskCreationDate = new Date(taskMock.createdAt);

    expect(taskCreationDateElem.textContent.trim().toLowerCase()).toBe(
      `created at: ${stringifyTaskDate(taskCreationDate)}`
    );
  });

  it('should display tast last update date', () => {

    const taskLastUpdateDateElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('[data-test-id="task-update-date"]'))
      .nativeElement;

    const taskLastUpdateDate = new Date(taskMock.updatedAt);

    expect(taskLastUpdateDateElem.textContent.trim().toLowerCase()).toBe(
      `updated at: ${stringifyTaskDate(taskLastUpdateDate)}`
    );
  });

  it('should display task status', () => {
    const taskStatusComponent: TaskStatusComponent = fixture.debugElement
      .query(By.css('app-task-status'))
      .componentInstance;

    expect(taskStatusComponent.task).toBe(taskMock);
  });

  it('should navigate to tasks edit form on tasks edit button click', fakeAsync(() => {

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('[data-test-id="task-edit-button"]'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe(`/tasks/edit/${taskMock.id}`);
  }));

  describe('delete task button', () => {

    let deleteTaskBtnElem: HTMLButtonElement;
    let router: Router;
    let windowConfirmSpy: jasmine.Spy;

    beforeEach(() => {

      tasksService.setState({
        currentTaskFetchingStatus: RequestStatus.Success,
        currentTask: taskMock
      });

      fixture.detectChanges();

      router = TestBed.get(Router);
      deleteTaskBtnElem = fixture.debugElement
        .query(By.css('[data-test-id="task-delete-button"]'))
        .nativeElement;

      windowConfirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    });

    it('should disable delete button on click', () => {

      deleteTaskBtnElem.click();
      fixture.detectChanges();

      deleteTaskBtnElem = fixture.debugElement
        .query(By.css('[data-test-id="task-delete-button"]'))
        .nativeElement;

      expect(deleteTaskBtnElem.disabled).toBe(true);
    });

    it('should disable edit button on click', () => {

      deleteTaskBtnElem.click();
      fixture.detectChanges();

      const editTaskBtnElem: HTMLButtonElement = fixture.debugElement
        .query(By.css('[data-test-id="task-edit-button"]'))
        .nativeElement;

      expect(editTaskBtnElem.disabled).toBe(true);
    });

    it('should delete task', () => {

      const observable = of();
      const subSpy = spyOn(observable, 'subscribe');
      const deleteTaskSpy = spyOn(tasksService, 'deleteTask').and.returnValue(observable);

      deleteTaskBtnElem.click();

      expect(subSpy).toHaveBeenCalled();
      expect(deleteTaskSpy).toHaveBeenCalledWith(taskMock.id);
    });

    it('should navigate to tasks list on deleting success', fakeAsync(() => {

      const spy = spyOn(router, 'navigate');

      spyOn(tasksService, 'deleteTask').and.returnValue(of(taskMock));

      deleteTaskBtnElem.click();
      tick();

      expect(spy).toHaveBeenCalledWith(['/tasks/1']);
    }));

    it('should not delete task if it has been canceled by user', () => {

      windowConfirmSpy.and.returnValue(false);

      const spy = spyOn(tasksService, 'deleteTask');

      deleteTaskBtnElem.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
