import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskComponent } from './task.component';
import { taskMock } from 'src/mocks/data/task.mock';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';
import { TaskStatus } from 'src/app/core/models/task.model';
import { ChangeDetectionStrategy } from '@angular/core';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let location: Location;

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: TaskComponent }
    ];

    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [RouterTestingModule.withRoutes(routes)]
    })
    .overrideComponent(TaskComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    component.task = taskMock;
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

    const taskStatusElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-status span:last-child'))
      .nativeElement;

    expect(taskStatusElem.textContent.trim()).toBe('in progress');
  });

  it('should display task status as "new" if task is new', () => {

    component.task = { ...taskMock, status: TaskStatus.New };

    fixture.detectChanges();

    const taskStatusElem: HTMLParagraphElement = fixture.debugElement
      .query(By.css('.task-status span:last-child'))
      .nativeElement;

    expect(taskStatusElem.textContent.trim()).toBe('new');
  });

  it('should display task status as "finished" if task is finished', () => {

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
});
