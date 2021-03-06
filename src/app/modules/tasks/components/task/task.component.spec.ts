import { Location } from '@angular/common';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { taskMock } from 'src/mocks/data/task.mock';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { TaskStatus } from '../../enums/task-status.enum';
import { TaskStatusComponent } from '../task-status/task-status.component';
import { TaskComponent } from './task.component';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let location: Location;
  let tasksService: TasksService;

  function initValues(): void {
    fixture = TestBed.createComponent(TaskComponent);
    location = TestBed.get(Location);
    tasksService = TestBed.get(TasksService);
    component = fixture.componentInstance;
    component.task = taskMock;
  }

  beforeEach(async(() => {
    const routes: Routes = [{ path: '**', component: TaskComponent }];

    TestBed.configureTestingModule({
      declarations: [TaskComponent, TaskStatusComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: TasksService, useClass: TasksServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    initValues();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task name', () => {
    const taskNameElem: HTMLHeadingElement = fixture.debugElement.query(By.css('.task-name'))
      .nativeElement;

    expect(taskNameElem.textContent).toBe(taskMock.name);
  });

  it('should display task description', () => {
    const taskDescElem: HTMLParagraphElement = fixture.debugElement.query(By.css('.task-desc'))
      .nativeElement;

    expect(taskDescElem.textContent).toBe(taskMock.description);
  });

  describe('task is new', () => {
    beforeEach(() => {
      initValues();
      component.task = { ...taskMock, status: TaskStatus.New };
      fixture.detectChanges();
    });

    it('should display "mark as started" button if task is new', () => {
      const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement.query(
        By.css('[data-test-id="task-status-button"]')
      ).nativeElement;

      expect(taskStatusBtnElem.textContent!.trim().toLowerCase()).toBe('mark as started');
    });

    it('should disable task status button on its click', () => {
      let taskStatusBtnElem: HTMLButtonElement = fixture.debugElement.query(
        By.css('[data-test-id="task-status-button"]')
      ).nativeElement;

      taskStatusBtnElem.click();

      taskStatusBtnElem = fixture.debugElement.query(By.css('[data-test-id="task-status-button"]'))
        .nativeElement;

      fixture.detectChanges();

      expect(taskStatusBtnElem.disabled).toBe(true);
    });

    it('should update task status to "in progress" on task status button click', () => {
      const observable = of();
      const subSpy = spyOn(observable, 'subscribe');
      const patchTaskSpy = spyOn(tasksService, 'patchTask').and.returnValue(observable);

      const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement.query(
        By.css('[data-test-id="task-status-button"]')
      ).nativeElement;

      taskStatusBtnElem.click();

      expect(subSpy).toHaveBeenCalled();
      expect(patchTaskSpy).toHaveBeenCalledWith({ status: TaskStatus.InProgress }, taskMock.id);
    });
  });

  describe('task is in progress', () => {
    beforeEach(() => {
      initValues();
      component.task = { ...taskMock, status: TaskStatus.InProgress };
      fixture.detectChanges();
    });

    it('should display "mark as finished" button', () => {
      const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement.query(
        By.css('[data-test-id="task-status-button"]')
      ).nativeElement;

      expect(taskStatusBtnElem.textContent!.trim().toLowerCase()).toBe('mark as finished');
    });

    it('should update task status to "finished" on task status button click', () => {
      const observable = of();
      const subSpy = spyOn(observable, 'subscribe');
      const patchTaskSpy = spyOn(tasksService, 'patchTask').and.returnValue(observable);

      const taskStatusBtnElem: HTMLButtonElement = fixture.debugElement.query(
        By.css('[data-test-id="task-status-button"]')
      ).nativeElement;

      taskStatusBtnElem.click();

      expect(subSpy).toHaveBeenCalled();
      expect(patchTaskSpy).toHaveBeenCalledWith({ status: TaskStatus.Finished }, taskMock.id);
    });
  });

  describe('task is finished', () => {
    beforeEach(() => {
      initValues();
      component.task = { ...taskMock, status: TaskStatus.Finished };
      fixture.detectChanges();
    });

    it('should add "finished" class to wrapper', () => {
      const wrapperElem: HTMLDivElement = fixture.debugElement.query(By.css('.wrapper'))
        .nativeElement;

      expect(wrapperElem.classList.contains('finished')).toBe(true);
    });

    it('should not display task status button if task is finished', () => {
      const taskStatusBtn = fixture.debugElement.query(
        By.css('[data-test-id="task-status-button"]')
      );

      expect(taskStatusBtn).toBeFalsy();
    });
  });

  it('should display task status', () => {
    const taskStatusComponent: TaskStatusComponent = fixture.debugElement.query(
      By.css('app-task-status')
    ).componentInstance;

    expect(taskStatusComponent.task).toBe(taskMock);
  });

  it('should navigate to task details on task details link click', fakeAsync(() => {
    const taskDetailsLinkElem: HTMLAnchorElement = fixture.debugElement.query(
      By.css('[data-test-id="task-details-link"]')
    ).nativeElement;

    taskDetailsLinkElem.click();
    tick();

    expect(location.path()).toBe(`/tasks/details/${taskMock.id}`);
  }));

  it('should enable task status button on task status change success', fakeAsync(() => {
    spyOn(tasksService, 'patchTask').and.returnValue(of(null));

    component.task = { ...taskMock, status: TaskStatus.InProgress };

    fixture.detectChanges();

    let taskStatusBtnElem: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-test-id="task-status-button"]')
    ).nativeElement;

    taskStatusBtnElem.click();
    tick();

    taskStatusBtnElem = fixture.debugElement.query(By.css('[data-test-id="task-status-button"]'))
      .nativeElement;

    fixture.detectChanges();

    expect(taskStatusBtnElem.disabled).toBe(false);
  }));
});
