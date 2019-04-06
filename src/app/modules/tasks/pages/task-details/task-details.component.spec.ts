import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskDetailsComponent } from './task-details.component';
import { Routes, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { TasksService } from 'src/app/core/services/tasks.service';
import { TasksServiceMock } from 'src/mocks/services/tasks.service.mock';
import { of } from 'rxjs';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let location: Location;
  let tasksService: TasksService;

  const params: Record<string, any> = {
    taskId: 9
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
      { path: '**', component: TaskDetailsComponent }
    ];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [TaskDetailsComponent],
      providers: [
        { provide: TasksService, useClass: TasksServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsComponent);
    location = TestBed.get(Location);
    tasksService = TestBed.get(TasksService);
    component = fixture.componentInstance;
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

  it('should navigate to tasks list on tasks list link click', fakeAsync(() => {

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.tasks-list-link'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/1');
  }));
});
