import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { CONFIG } from 'src/app/core/injection-tokens/config.token';
import { config } from 'src/config';
import { taskMock } from 'src/mocks/data/task.mock';
import { RequestStatus } from '../../../shared/enums/request-status.enum';
import { IServerPaginationResponse } from '../../../shared/interfaces/server-pagination-response.interface';
import { TaskStatus } from '../enums/task-status.enum';
import { ITaskCreationData } from '../interfaces/task-creation-data.interface';
import { ITaskUpdateData } from '../interfaces/task-update-data.interface';
import { ITask } from '../interfaces/task.interface';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let httpClientMock: HttpTestingController;
  let appConfig: typeof config;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService, { provide: CONFIG, useValue: config }]
    });

    tasksService = TestBed.get(TasksService);
    httpClientMock = TestBed.get(HttpTestingController);
    appConfig = TestBed.get(CONFIG);
  });

  it('should be created', () => {
    expect(tasksService).toBeTruthy();
  });

  describe('#getTasks', () => {
    let paginationRes: IServerPaginationResponse<ITask>;

    beforeEach(() => {
      paginationRes = {
        data: new Array(appConfig.recordsPerPage).fill(taskMock),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };
    });

    it('should return an observable', () => {
      const value = tasksService.getTasks(1);

      expect(value instanceof Observable).toBe(true);
    });

    it('should fetch proper number of tasks', () => {
      const pageNumber = 1;

      tasksService.getTasks(pageNumber).subscribe(tasks => {
        expect(tasks).toEqual(paginationRes.data);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      req.flush(paginationRes);
    });

    it('should fetch proper number of tasks skipping proper number of tasks', () => {
      const pageNumber = 3;

      tasksService.getTasks(pageNumber).subscribe(tasks => {
        expect(tasks).toEqual(paginationRes.data);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      req.flush(paginationRes);
    });

    it('should update request status to "pending" on fetching start', () => {
      const pageNumber = 1;

      tasksService.getTasks(pageNumber).subscribe();

      expect(tasksService.state.tasksFetchingStatus).toBe(RequestStatus.Pending);

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      req.flush(paginationRes);
    });

    it('should update state on fetching success', () => {
      const pageNumber = 1;

      tasksService.getTasks(pageNumber).subscribe(() => {
        expect(tasksService.state.tasks).toEqual(paginationRes.data);
        expect(tasksService.state.tasksFetchingStatus).toBe(RequestStatus.Success);
        expect(tasksService.state.tasksPagination).toEqual({ prevPage: null, nextPage: null });
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      req.flush(paginationRes);
    });

    it('should set number of prev page', () => {
      const pageNumber = 5;

      tasksService.getTasks(pageNumber).subscribe(() => {
        expect(tasksService.state.tasksPagination).toEqual({ prevPage: 4, nextPage: null });
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      paginationRes.page = 5;
      paginationRes.pageCount = 5;

      req.flush(paginationRes);
    });

    it('should set number of the next page', () => {
      const pageNumber = 1;

      tasksService.getTasks(pageNumber).subscribe(() => {
        expect(tasksService.state.tasksPagination).toEqual({ prevPage: null, nextPage: 2 });
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      paginationRes.page = 1;
      paginationRes.pageCount = 5;

      req.flush(paginationRes);
    });

    it('should update request status to "error" on fetching failure', () => {
      const pageNumber = 1;

      tasksService.getTasks(pageNumber).subscribe({
        error: () => expect(tasksService.state.tasksFetchingStatus).toBe(RequestStatus.Error)
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      req.error(new ErrorEvent('unknown error'));
    });

    it('should emit error with http error reponse on fetching failure', done => {
      const pageNumber = 1;

      tasksService.getTasks(pageNumber).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error instanceof HttpErrorResponse).toBe(true);
          done();
        }
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks?page=${pageNumber}&limit=${appConfig.recordsPerPage}`
      });

      req.error(new ErrorEvent('unknown error'));
    });
  });

  describe('#patchTask', () => {
    it('should return an observable', () => {
      const value = tasksService.patchTask({}, 'uuid');

      expect(value instanceof Observable).toBe(true);
    });

    it('should patch specific task', () => {
      const patchData: ITaskUpdateData = { name: 'sample name' };
      const taskId = 'uuid';
      const patchRes = { ...taskMock, ...patchData };

      tasksService.patchTask(patchData, taskId).subscribe(task => {
        expect(task).toEqual(patchRes);
      });

      const req = httpClientMock.expectOne({
        method: 'PATCH',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      expect(req.request.body).toEqual(patchData);

      req.flush(patchRes);
    });

    it('should patch fetched task on tasks list', () => {
      const fetchingResponse: IServerPaginationResponse<ITask> = {
        data: new Array(appConfig.recordsPerPage)
          .fill(taskMock)
          .map((task: ITask, index) => ({ ...task, id: task.id + index })),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      const patchData: ITaskUpdateData = {
        name: 'sample new task name',
        description: 'updated description'
      };

      const taskId = 'uuid8';
      const patchRes = { ...taskMock, ...patchData, id: taskId };

      tasksService.patchTask(patchData, taskId).subscribe(() => {
        const { data } = fetchingResponse;

        const expectedState: Array<ITask> = [
          ...data.slice(
            0,
            data.findIndex(task => task.id === taskId)
          ),
          { ...data.find(task => task.id === taskId), ...patchRes },
          ...data.slice(data.findIndex(task => task.id === taskId) + 1)
        ];

        expect(tasksService.state.tasks).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'PATCH' }).flush(patchRes);
    });

    it('should patch fetched current task', () => {
      tasksService.getTask(taskMock.id).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(taskMock);

      const patchData: ITaskUpdateData = {
        name: 'sample new task name',
        description: 'updated description'
      };

      const patchRes = {
        ...taskMock,
        ...patchData,
        id: taskMock.id
      };

      tasksService.patchTask(patchData, taskMock.id).subscribe(() => {
        const expectedState: ITask = { ...taskMock, ...patchData };
        expect(tasksService.state.currentTask).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'PATCH' }).flush(patchRes);
    });
  });

  describe('#getTask', () => {
    const taskId = 'uuid8';
    let res: ITask;

    beforeEach(() => {
      res = { ...taskMock, id: taskId };
    });

    it('should return an observable', () => {
      const value = tasksService.getTask(taskId);

      expect(value instanceof Observable).toBe(true);
    });

    it('should fetch specific task', () => {
      tasksService.getTask(taskId).subscribe(task => {
        expect(task).toEqual(res);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should update request status to "pending" on fetching start', () => {
      tasksService.getTask(taskId).subscribe();

      expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Pending);

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should update request status to "error" on fetching failure', () => {
      tasksService.getTask(taskId).subscribe({
        error: () => expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Error)
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      req.error(new ErrorEvent('unknown error'));
    });

    it('should update request status to "success" on fetching success', () => {
      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Success);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should update state to fetched task on fetching success', () => {
      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTask).toBe(res);
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      req.flush(res);
    });

    it('should return cached task from tasks list', () => {
      const fetchingResponse: IServerPaginationResponse<ITask> = {
        data: new Array(appConfig.recordsPerPage)
          .fill(taskMock)
          .map((task: ITask, index) => ({ ...task, id: task.id + index })),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskId).subscribe(task => {
        expect(task).toBe(fetchingResponse.data[8]);
      });
    });

    it('should return current cached task', () => {
      tasksService.getTask(taskMock.id).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(taskMock);

      tasksService.getTask(taskMock.id).subscribe(task => {
        expect(task).toBe(taskMock);
      });
    });

    it('should update state to cached task', () => {
      const fetchingResponse: IServerPaginationResponse<ITask> = {
        data: new Array(appConfig.recordsPerPage)
          .fill(taskMock)
          .map((task: ITask, index) => ({ ...task, id: task.id + index })),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTask).toBe(fetchingResponse.data[8]);
      });
    });

    it('should update fetching status to "success" when returning cached task', () => {
      const fetchingResponse: IServerPaginationResponse<ITask> = {
        data: new Array(appConfig.recordsPerPage)
          .fill(taskMock)
          .map((task: ITask, index) => ({ ...task, id: task.id + index })),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.getTask(taskId).subscribe(() => {
        expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.Success);
      });
    });

    it('should update request status to "not found" it task has not been found', () => {
      tasksService.getTask(taskId).subscribe({
        error: () => {
          expect(tasksService.state.currentTaskFetchingStatus).toBe(RequestStatus.NotFound);
        }
      });

      const req = httpClientMock.expectOne({
        method: 'GET',
        url: `${appConfig.env.apiUrl}/tasks/${taskId}`
      });

      req.error(new ErrorEvent('404 not found'), { status: 404 });
    });
  });

  describe('#deleteTask', () => {
    it('should return an observable', () => {
      const value = tasksService.deleteTask('uuid');

      expect(value instanceof Observable).toBe(true);
    });

    it('should delete specific task', () => {
      tasksService.deleteTask(taskMock.id).subscribe(task => {
        expect(task).toBeNull();
      });

      const req = httpClientMock.expectOne({
        method: 'DELETE',
        url: `${appConfig.env.apiUrl}/tasks/${taskMock.id}`
      });

      req.flush(null);
    });

    it('should delete fetched task from the list', () => {
      const fetchingResponse: IServerPaginationResponse<ITask> = {
        data: new Array(appConfig.recordsPerPage)
          .fill(taskMock)
          .map((task: ITask, index) => ({ ...task, id: task.id + index })),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      const taskId = 'uuid8';

      tasksService.deleteTask(taskId).subscribe(() => {
        const { data } = fetchingResponse;
        const expectedState: Array<ITask> = [
          ...data.slice(
            0,
            data.findIndex(task => task.id === taskId)
          ),
          ...data.slice(data.findIndex(task => task.id === taskId) + 1)
        ];

        expect(tasksService.state.tasks).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'DELETE' }).flush({ data: { ...taskMock, id: taskId } });
    });

    it('should delete fetched current task', () => {
      tasksService.getTask(taskMock.id).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(taskMock);

      tasksService.deleteTask(taskMock.id).subscribe(() => {
        expect(tasksService.state.currentTask).toBe(null);
      });

      httpClientMock.expectOne({ method: 'DELETE' }).flush({ data: taskMock });
    });
  });

  describe('#createTask', () => {
    let newTask: ITaskCreationData;
    let newTaskRes: ITask;

    beforeEach(() => {
      newTask = { name: 'name', description: 'description', status: TaskStatus.New };
      newTaskRes = { ...taskMock, ...newTask };
    });

    it('should return an observable', () => {
      const value = tasksService.createTask(newTask);

      expect(value instanceof Observable).toBe(true);
    });

    it('should create task', () => {
      tasksService.createTask(newTask).subscribe(task => {
        expect(task).toEqual(newTaskRes);
      });

      const req = httpClientMock.expectOne({
        method: 'POST',
        url: `${appConfig.env.apiUrl}/tasks`
      });

      expect(req.request.body).toEqual(newTask);

      req.flush(newTaskRes);
    });

    it('should put created task to state', () => {
      tasksService.createTask(newTask).subscribe(task => {
        expect(tasksService.state.tasks).toEqual([task]);
      });

      const req = httpClientMock.expectOne({
        method: 'POST',
        url: `${appConfig.env.apiUrl}/tasks`
      });

      expect(req.request.body).toEqual(newTask);

      req.flush(newTaskRes);
    });

    it('should put created task to state at the begining of tasks list', () => {
      const fetchingResponse: IServerPaginationResponse<ITask> = {
        data: new Array(appConfig.recordsPerPage)
          .fill(taskMock)
          .map((task: ITask, index) => ({ ...task, id: task.id + index })),
        count: appConfig.recordsPerPage,
        total: appConfig.recordsPerPage,
        page: 1,
        pageCount: 1
      };

      tasksService.getTasks(1).subscribe();
      httpClientMock.expectOne({ method: 'GET' }).flush(fetchingResponse);

      tasksService.createTask(newTask).subscribe(task => {
        const expectedState: Array<ITask> = [task, ...fetchingResponse.data];

        expect(tasksService.state.tasks).toEqual(expectedState);
      });

      httpClientMock.expectOne({ method: 'POST' }).flush(newTaskRes);
    });
  });

  afterEach(() => {
    httpClientMock.verify();
  });
});
