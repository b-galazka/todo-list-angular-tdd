import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TaskStatus } from 'src/app/core/models/task.model';
import { taskMock } from 'src/mocks/data/task.mock';
import { TaskStatusComponent } from './task-status.component';

describe('TaskStatusComponent', () => {
  let component: TaskStatusComponent;
  let fixture: ComponentFixture<TaskStatusComponent>;
  let debugElement: DebugElement;

  function initValues(): void {
    fixture = TestBed.createComponent(TaskStatusComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.task = taskMock;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    initValues();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render task status for new task', () => {
    initValues();
    component.task = { ...taskMock, status: TaskStatus.New };
    fixture.detectChanges();

    const taskStatusElem = debugElement.query(By.css('[data-test-id="new-task-status"]'));

    expect(taskStatusElem).toBeTruthy();
  });

  it('should render task status for task which is in progress', () => {
    initValues();
    component.task = { ...taskMock, status: TaskStatus.InProgress };
    fixture.detectChanges();

    const taskStatusElem = debugElement.query(By.css('[data-test-id="in-progress-task-status"]'));

    expect(taskStatusElem).toBeTruthy();
  });

  it('should render task status for finished task', () => {
    initValues();
    component.task = { ...taskMock, status: TaskStatus.Finished };
    fixture.detectChanges();

    const taskStatusElem = debugElement.query(By.css('[data-test-id="finished-task-status"]'));

    expect(taskStatusElem).toBeTruthy();
  });
});
