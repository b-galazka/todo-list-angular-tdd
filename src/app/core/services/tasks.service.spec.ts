import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';
import { Observable } from 'rxjs';
import { task } from 'src/mocks/task.mock';
import { environment } from 'src/environments/environment';
import { IServerResponse } from '../models/server-response.model';
import { ITask } from '../models/task.model';

describe('TasksService', () => {

  let tasksService: TasksService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    tasksService = TestBed.get(TasksService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(tasksService).toBeTruthy();
  });

  describe('#getTasks', () => {

    let res: IServerResponse<Array<ITask>>;

    beforeEach(() => {

      res = {
        data: new Array(15).fill(task),
          pagination: { }
      };
    });

    it('should return an observable', () => {

      const value = tasksService.getTasks(1);

      expect(value instanceof Observable).toBe(true);
    });

    it('should fetch 15 tasks', () => {

      tasksService.getTasks(1).subscribe((tasks) => {

        expect(tasks).toEqual(res.data);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=0&limit=15`
      });

      req.flush(res);
    });

    it('should fetch 15 tasks skipping 30', () => {

      tasksService.getTasks(3).subscribe((tasks) => {

        expect(tasks).toEqual(res.data);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=30&limit=15`
      });

      req.flush(res);
    });
  });

  afterEach(() => {

    httpClientMock.verify();
  });
});
