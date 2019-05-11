import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { TaskComponent } from './task.component';
import { taskMock } from 'src/mocks/data/task.mock';
import { TaskStatus } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/core/services/tasks.service';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let location: Location;

  function initValues(): void {
    fixture = TestBed.createComponent(TaskComponent);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    component.task = taskMock;
  }

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: TaskComponent }
    ];

    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [RouterTestingModule.withRoutes(routes) ],
      providers: [
        { provide: TasksService, useClass: TasksServiceMock }
      ]
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

  it('should display task name', () => {

    const taskNameElem: HTMLHeadingElement = fixture.debugElement
      .query(By.css('.task-name'))
      .nativeElement;

    expect(taskNameElem.textContent).toBe(taskMock.name);
  });

  it('should display task description', () => {

    const taskDescElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-desc'))
      .nativeElement;

    expect(taskDescElem.textContent).toBe(taskMock.description);
  });

  it('should display task status as "in progress" if task is in progress', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.InProgress };

    fixture.detectChanges();

    const taskStatusElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-status span:last-child'))
      .nativeElement;

    expect(taskStatusElem.textContent.trim()).toBe('in progress');
  });

  it('should display task status as "new" if task is new', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.New };

    fixture.detectChanges();

    const taskStatusElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-status span:last-child'))
      .nativeElement;

    expect(taskStatusElem.textContent.trim()).toBe('new');
  });

  it('should display task status as "finished" if task is finished', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.Finished };

    fixture.detectChanges();

    const taskStatusElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-status span:last-child'))
      .nativeElement;

    expect(taskStatusElem.textContent.trim()).toBe('finished');
  });

  it('should navigate to task details on task details link click', fakeAsync(() => {

    const taskDetailsLinkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.task-details-link'))
      .nativeElement;

    taskDetailsLinkElem.click();
    tick();

    expect(location.path()).toBe(`/tasks/details/${taskMock.id}`);
  }));

  it('should add "finished" class to wrapper if task is finished', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.Finished };

    fixture.detectChanges();

    const wrapperElem: HTMLDivElement = fixture.debugElement
      .query(By.css('.wrapper'))
      .nativeElement;

    expect(wrapperElem.classList.contains('finished')).toBe(true);
  });

  it('should display "mark as started" button if task is new', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.New };

    fixture.detectChanges();

    const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement
      .query(By.css('.task-status-button'))
      .nativeElement;

    expect(taskStatusBtnElem.textContent.trim().toLowerCase()).toBe('mark as started');
  });

  it('should display "mark as finished" button if task is already in progress', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.InProgress };

    fixture.detectChanges();

    const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement
      .query(By.css('.task-status-button'))
      .nativeElement;

    expect(taskStatusBtnElem.textContent.trim().toLowerCase()).toBe('mark as finished');
  });

  it('should not display task status button if task is finished', () => {

    initValues();

    component.task = { ...taskMock, status: TaskStatus.Finished };

    fixture.detectChanges();

    const taskStatusBtn = fixture.debugElement.query(By.css('.task-status-button'));

    expect(taskStatusBtn).toBeFalsy();
  });

  describe('task status button click', () => {

    let tasksService: TasksService;

    beforeEach(() => {
      tasksService = TestBed.get(TasksService);
    });

    it('should disable button on click', () => {

      component.task = { ...taskMock, status: TaskStatus.New };

      fixture.detectChanges();

      let taskStatusBtnElem: HTMLButtonElement = fixture.debugElement
        .query(By.css('.task-status-button'))
        .nativeElement;

      taskStatusBtnElem.click();

      taskStatusBtnElem = fixture.debugElement
        .query(By.css('.task-status-button'))
        .nativeElement;

      fixture.detectChanges();

      expect(taskStatusBtnElem.disabled).toBe(true);
    });

    it('should update task status to "in progress" on click if task is new', () => {

      const observable = of();
      const subSpy = spyOn(observable, 'subscribe');
      const patchTaskSpy = spyOn(tasksService, 'patchTask').and.returnValue(observable);

      component.task = { ...taskMock, status: TaskStatus.New };

      fixture.detectChanges();

      const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement
        .query(By.css('.task-status-button'))
        .nativeElement;

      taskStatusBtnElem.click();

      expect(subSpy).toHaveBeenCalled();
      expect(patchTaskSpy).toHaveBeenCalledWith({ status: TaskStatus.InProgress }, taskMock.id);
    });

    it('should update task status to "finished" on click if task is in progress', () => {

      const observable = of();
      const subSpy = spyOn(observable, 'subscribe');
      const patchTaskSpy = spyOn(tasksService, 'patchTask').and.returnValue(observable);

      component.task = { ...taskMock, status: TaskStatus.InProgress };

      fixture.detectChanges();

      const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement
        .query(By.css('.task-status-button'))
        .nativeElement;

      taskStatusBtnElem.click();

      expect(subSpy).toHaveBeenCalled();
      expect(patchTaskSpy).toHaveBeenCalledWith({ status: TaskStatus.Finished }, taskMock.id);
    });

    it('should enable button on request success', fakeAsync(() => {

      spyOn(tasksService, 'patchTask').and.returnValue(of(null));

      component.task = { ...taskMock, status: TaskStatus.InProgress };

      fixture.detectChanges();

      let taskStatusBtnElem: HTMLButtonElement = fixture.debugElement
        .query(By.css('.task-status-button'))
        .nativeElement;

      taskStatusBtnElem.click();
      tick();

      taskStatusBtnElem = fixture.debugElement
        .query(By.css('.task-status-button'))
        .nativeElement;

      fixture.detectChanges();

      expect(taskStatusBtnElem.disabled).toBe(false);
    }));
  });
});
