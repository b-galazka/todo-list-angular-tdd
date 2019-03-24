import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksListComponent } from './tasks-list.component';
import { TasksService } from 'src/app/core/services/tasks.service';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskComponent } from '../../components/task/task.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ITask } from 'src/app/core/models/task.model';
import { taskMock } from 'src/mocks/data/task.mock';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { By } from '@angular/platform-browser';

describe('TasksListComponent', () => {

  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let tasksService: TasksServiceMock;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on :page param change', () => {

    const page = 89;
    const spy = spyOn(tasksService, 'getTasks');

    (<Subject<any>> activatedRoute.params).next({ page });

    expect(spy).toHaveBeenCalledWith(page);
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
});
