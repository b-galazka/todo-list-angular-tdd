import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TasksService } from './tasks.service';
import { taskMock } from 'src/mocks/data/task.mock';
import { environment } from 'src/environments/environment';
import { IServerResponse } from '../models/server-response.model';
import { ITask, TaskStatus, ITaskCreationData } from '../models/task.model';
import { RequestStatus } from '../models/server-request.model';


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

    it('should patch fetched task on tasks list', () => {

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

    it('should patch fetched current task', () => {

      const fetchingResponse: IServerResponse<ITask> = { data: taskMock };

      tasksService.getTask(taskMock.id).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      const patchData: Partial<ITask> = {
        name: 'sample new task name',
        description: 'updated description'
      };

      patchRes.data = { ...patchRes.data, ...patchData, id: taskMock.id };

      tasksService.patchTask(patchData, taskMock.id).subscribe(() => {
        const expectedState: ITask = { ...fetchingResponse.data, ...patchData };
        expect(tasksService.state.currentTask).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'PATCH' }).flush(patchRes);
    });
  });

  describe('#getTask', () => {

    const taskId = 8;

    let res: IServerResponse<ITask>;

    beforeAll(() => {

      res = {
        data: { ...taskMock, id: taskId }
      };
    });

    it('should return an observable', () => {

      const value = tasksService.getTask(1);

      expect(value instanceof Observable).toBe(true);
    });

    it('should fetch specific task', () => {

      tasksService.getTask(taskId).subscribe((task) => {
        expect(task).toEqual(res.data);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should update request status to "pending" on fetching start', () => {

      tasksService.getTask(taskId).subscribe();

      expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Pending);

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should update request status to "error" on fetching failure', () => {

      tasksService.getTask(taskId).subscribe(null, () => {
        expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Error);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      req.error(new ErrorEvent('unknown error'));
    });

    it('should update request status to "success" on fetching success', () => {

      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Success);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should update state to fetched task on fetching success', () => {

      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTask).toBe(res.data);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should return cached task from tasks list', () => {

      const fetchingResponse: IServerResponse<Array<ITask>> = {
        data: new Array(15).fill(taskMock).map((task: ITask, index) => ({ ...task, id: index })),
        pagination: {}
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskId).subscribe((task) => {
        expect(task).toBe(fetchingResponse.data[8]);
      });
    });

    it('should return current cached task', () => {

      const fetchingResponse: IServerResponse<ITask> = { data: taskMock };

      tasksService.getTask(taskMock.id).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskMock.id).subscribe((task) => {
        expect(task).toBe(taskMock);
      });
    });

    it('should update state to cached task', () => {

      const fetchingResponse: IServerResponse<Array<ITask>> = {
        data: new Array(15).fill(taskMock).map((task: ITask, index) => ({ ...task, id: index })),
        pagination: {}
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTask).toBe(fetchingResponse.data[8]);
      });
    });

    it('should update fetching status to "success" when returning cached task', () => {

      const fetchingResponse: IServerResponse<Array<ITask>> = {
        data: new Array(15).fill(taskMock).map((task: ITask, index) => ({ ...task, id: index })),
        pagination: {}
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Success);
      });
    });

    it('should update request status to "not found" it task has not been found', () => {

      tasksService.getTask(taskId).subscribe(null, () => {
        expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.NotFound);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${environment.apiUrl}/tasks/${taskId}`
      });

      req.error(new ErrorEvent('404 not found'), { status: 404 });
    });
  });

  describe('#deleteTask', () => {

    it('should return an observable', () => {

      const value = tasksService.deleteTask(1);

      expect(value instanceof Observable).toBe(true);
    });

    it('should delete specific task', () => {

      tasksService.deleteTask(taskMock.id).subscribe((task) => {
        expect(task).toEqual(taskMock);
      });

      const req = httpClientMock.expectOne({
        method: 'DELETE',
        url: `${environment.apiUrl}/tasks/${taskMock.id}`
      });

      req.flush({ data: taskMock });
    });

    it('should delete fetched task from the list', () => {

      const fetchingResponse: IServerResponse<Array<ITask>> = {
        data: new Array(15).fill(taskMock).map((task: ITask, index) => ({ ...task, id: index })),
        pagination: {}
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      const taskId = 9;

      tasksService.deleteTask(taskId).subscribe(() => {

        const { data } = fetchingResponse;
        const expectedState: Array<ITask> = [...data.slice(0, taskId), ...data.slice(taskId + 1)];

        expect(tasksService.state.tasks).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'DELETE' }).flush({ data: { ...taskMock, id: taskId } });
    });

    it('should delete fetched current task', () => {

      const fetchingResponse: IServerResponse<ITask> = { data: taskMock };

      tasksService.getTask(taskMock.id).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.deleteTask(taskMock.id).subscribe(() => {
        expect(tasksService.state.currentTask).toBe(null);
      });

      httpClientMock.expectOne({ method: 'DELETE' }).flush({ data: taskMock });
    });
  });

  describe('#createTask', () => {

    let newTask: ITaskCreationData;
    let res: IServerResponse<ITask>;

    beforeEach(() => {

      newTask = { name: 'name', description: 'description', status: TaskStatus.New };
      res = { data: { ...taskMock, ...newTask } };
    });

    it('should return an observable', () => {

      const value = tasksService.createTask(newTask);

      expect(value instanceof Observable).toBe(true);
    });

    it('should create task', () => {

      tasksService.createTask(newTask).subscribe((task) => {
        expect(task).toEqual(res.data);
      });

      const req = httpClientMock.expectOne({
        method: 'POST',
        url: `${environment.apiUrl}/tasks`
      });

      expect(req.request.body).toEqual({ task: newTask });

      req.flush(res);
    });

    it('should put created task to state', () => {

      tasksService.createTask(newTask).subscribe((task) => {
        expect(tasksService.state.tasks).toEqual([task]);
      });

      const req = httpClientMock.expectOne({
        method: 'POST',
        url: `${environment.apiUrl}/tasks`
      });

      expect(req.request.body).toEqual({ task: newTask });

      req.flush(res);
    });

    it('should put created task to state at the begining of tasks list', () => {

      const fetchingResponse: IServerResponse<Array<ITask>> = {
        data: new Array(15).fill(taskMock).map((task: ITask, index) => ({ ...task, id: index })),
        pagination: {}
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.createTask(newTask).subscribe((task) => {

        const expectedState: Array<ITask> = [task, ...fetchingResponse.data];

        expect(tasksService.state.tasks).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'POST' }).flush(res);
    });
  });

  afterEach(() => {

    httpClientMock.verify();
  });
});
