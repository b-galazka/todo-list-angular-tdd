import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';
import { Observable } from 'rxjs';
import { taskMock } from 'src/mocks/data/task.mock';
import { environment } from 'src/environments/environment';
import { IServerResponse } from '../models/server-response.model';
import { ITask } from '../models/task.model';
import { RequestStatus } from '../models/server-request.model';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

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
        data: new Array(15).fill(taskMock),
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

    it('should update request status to "pending" on fetching start', () => {

      tasksService.getTasks(1).subscribe();

      expect(tasksService.state.tasksFetchingStatus).toBe(RequestStatus.Pending);

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=0&limit=15`
      });

      req.flush(res);
    });

    it('should update state on fetching success', () => {

      tasksService.getTasks(1).subscribe(() => {
        expect(tasksService.state.tasks).toEqual(res.data);
        expect(tasksService.state.tasksFetchingStatus).toBe(RequestStatus.Success);
        expect(tasksService.state.tasksPagination).toEqual({ prevPage: null, nextPage: null });
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=0&limit=15`
      });

      req.flush(res);
    });

    it('should set number of prev page', () => {

      tasksService.getTasks(5).subscribe(() => {
        expect(tasksService.state.tasksPagination).toEqual({ prevPage: 4, nextPage: null });
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=60&limit=15`
      });

      res.pagination.prev = { offset: 45, limit: 15 };

      req.flush(res);
    });

    it('should set number of the next page', () => {

      tasksService.getTasks(5).subscribe(() => {
        expect(tasksService.state.tasksPagination).toEqual({ prevPage: null, nextPage: 6 });
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=60&limit=15`
      });

      res.pagination.next = { offset: 75, limit: 15 };

      req.flush(res);
    });

    it('should update request status to "error" on fetching failure', () => {

      tasksService.getTasks(1).subscribe(null, () => {
        expect(tasksService.state.tasksFetchingStatus).toBe(RequestStatus.Error);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=0&limit=15`
      });

      req.error(new ErrorEvent('unknown error'));
    });

    it('should emit error with http error reponse on fetching failure', (done) => {

      tasksService.getTasks(1).subscribe(null, (error: HttpErrorResponse) => {
        expect(error instanceof HttpErrorResponse).toBe(true);
        done();
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks?offset=0&limit=15`
      });

      req.error(new ErrorEvent('unknown error'));
    });
  });

  describe('#patchTask', () => {

    let patchRes: IServerResponse<ITask>;

    beforeEach(() => {
      patchRes = { data: taskMock };
    });

    it('should return an observable', () => {

      const value = tasksService.patchTask({}, 1);

      expect(value instanceof Observable).toBe(true);
    });

    it('should patch specific task', () => {

      const patchData: Partial<ITask> = { name: 'sample name' };
      const taskId = 1;

      patchRes.data = { ...patchRes.data, ...patchData };

      tasksService.patchTask(patchData, taskId).subscribe((task) => {
        expect(task).toEqual(patchRes.data);
      });

      const req = httpClientMock.expectOne({
        method: 'PATCH',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      expect(req.request.body).toEqual({ task: patchData });

      req.flush(patchRes);
    });

    it('should patch fetched task', () => {

      const fetchingResponse: IServerResponse<Array<ITask>> = {
        data: new Array(15).fill(taskMock).map((task: ITask, index) => ({ ...task, id: index })),
        pagination: {}
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      const patchData: Partial<ITask> = {
        name: 'sample new task name',
        description: 'updated description'
      };

      const taskId = 9;

      patchRes.data = { ...patchRes.data, ...patchData, id: taskId };

      tasksService.patchTask(patchData, taskId).subscribe(() => {

        const { data } = fetchingResponse;

        const expectedState: Array<ITask> = [
          ...data.slice(0, taskId),
          { ...data[taskId], ...patchRes.data },
          ...data.slice(taskId + 1)
        ];

        expect(tasksService.state.tasks).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'PATCH' }).flush(patchRes);
    });
  });

  afterEach(() => {

    httpClientMock.verify();
  });
});
