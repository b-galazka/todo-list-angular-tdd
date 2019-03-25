import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TasksListComponent } from './tasks-list.component';
import { TasksService } from 'src/app/core/services/tasks.service';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Routes } from '@angular/router';
import { Subject, of } from 'rxjs';
import { TaskComponent } from '../../components/task/task.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ITask } from 'src/app/core/models/task.model';
import { taskMock } from 'src/mocks/data/task.mock';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('TasksListComponent', () => {

  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let tasksService: TasksServiceMock;
  let activatedRoute: ActivatedRoute;
  let location: Location;

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: TasksListComponent }
    ];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [TasksListComponent, TaskComponent],
      providers: [
        { provide: TasksService, useClass: TasksServiceMock },
        { provide: ActivatedRoute, useValue: { params: new Subject<any>() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksListComponent);
    tasksService = TestBed.get(TasksService);
    activatedRoute = TestBed.get(ActivatedRoute);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on :page param change', () => {

    const page = 89;
    const observable = of();
    const subSpy = spyOn(observable, 'subscribe');
    const getTasksSpy = spyOn(tasksService, 'getTasks').and.returnValue(observable);

    (<Subject<any>> activatedRoute.params).next({ page });

    expect(getTasksSpy).toHaveBeenCalledWith(page);
    expect(subSpy).toHaveBeenCalled();
  });

  it('should render all fetched tasks', () => {

    const tasksAmount = 10;

    const tasks: Array<ITask> = new Array(tasksAmount).fill(null).map(
      (item, index) => ({ ...taskMock, id: index })
    );

    tasksService.setState({ tasks, tasksFetchingStatus: RequestStatus.Success });

    fixture.detectChanges();

    const tasksComponents: Array<TaskComponent> = fixture.debugElement
      .queryAll(By.css('app-task'))
      .map(taskDebugElem => taskDebugElem.componentInstance);

    expect(tasksComponents.length).toBe(tasksAmount);

    tasksComponents.forEach(
      (taskComponent, index) => expect(taskComponent.task).toBe(tasks[index])
    );
  });

  it('should render loader during tasks fetching', () => {

    tasksService.setState({ tasksFetchingStatus: RequestStatus.Pending });

    fixture.detectChanges();

    const loaderElem = fixture.debugElement.query(By.css('.loader'));

    expect(loaderElem).toBeTruthy();
  });

  it('should render error message if tasks fetching has failed', () => {

    tasksService.setState({ tasksFetchingStatus: RequestStatus.Error });

    fixture.detectChanges();

    const errorElem = fixture.debugElement.query(By.css('.fetching-error'));

    expect(errorElem).toBeTruthy();
  });

  it('should navigate to new task form on new task link click', fakeAsync(() => {

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.new-task-link'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/new');
  }));

  it('should navigate to prev page on prev link click', fakeAsync(() => {

    tasksService.setState({
      tasksFetchingStatus: RequestStatus.Success,
      tasksPagination: { prevPage: 5, nextPage: null }
    });

    fixture.detectChanges();

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.prev-page-link'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/5');
  }));

  it('should not show prev page link if prev page does not exist', () => {

    tasksService.setState({
      tasksFetchingStatus: RequestStatus.Success,
      tasksPagination: { prevPage: null, nextPage: null }
    });

    fixture.detectChanges();

    const linkElem = fixture.debugElement.query(By.css('.prev-page-link'));

    expect(linkElem).toBeFalsy();
  });

  it('should navigate to the next page on next link click', fakeAsync(() => {

    tasksService.setState({
      tasksFetchingStatus: RequestStatus.Success,
      tasksPagination: { prevPage: null, nextPage: 6 }
    });

    fixture.detectChanges();

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.next-page-link'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/6');
  }));

  it('should not show the next page link if next page does not exist', () => {

    tasksService.setState({
      tasksFetchingStatus: RequestStatus.Success,
      tasksPagination: { prevPage: null, nextPage: null }
    });

    fixture.detectChanges();

    const linkElem = fixture.debugElement.query(By.css('.next-page-link'));

    expect(linkElem).toBeFalsy();
  });

  it('should not fetch tasks if :page is not an integer', () => {

    const page = 'some text';
    const observable = of();
    const subSpy = spyOn(observable, 'subscribe');
    const getTasksSpy = spyOn(tasksService, 'getTasks').and.returnValue(observable);

    (<Subject<any>> activatedRoute.params).next({ page });

    expect(getTasksSpy).not.toHaveBeenCalled();
    expect(subSpy).not.toHaveBeenCalled();
  });

  it('should show error if :page is not an integer', () => {

    const page = 'some text';

    (<Subject<any>> activatedRoute.params).next({ page });

    fixture.detectChanges();

    const pageNumberErrorElem = fixture.debugElement.query(By.css('.page-number-error'));

    expect(pageNumberErrorElem).toBeTruthy();
  });

  it('should show error if :page is not an positive integer', () => {

    const page = -1;

    (<Subject<any>> activatedRoute.params).next({ page });

    fixture.detectChanges();

    const pageNumberErrorElem = fixture.debugElement.query(By.css('.page-number-error'));

    expect(pageNumberErrorElem).toBeTruthy();
  });
});
