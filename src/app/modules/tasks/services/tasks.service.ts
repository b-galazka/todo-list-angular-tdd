import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, pluck, tap } from 'rxjs/operators';

import { CONFIG } from 'src/app/core/injection-tokens/config.token';
import { IPaginationState } from 'src/app/shared/interfaces/pagination-state.interface';
import { convertObjectToHttpParams } from 'src/app/shared/utils/http-client.utils';
import { config } from 'src/config';
import { RequestStatus } from '../../../shared/enums/request-status.enum';
import { IDataService } from '../../../shared/interfaces/data.service.interface';
import { IServerPaginationResponse } from '../../../shared/interfaces/server-pagination-response.interface';
import { ITaskCreationData } from '../interfaces/task-creation-data.interface';
import { ITaskUpdateData } from '../interfaces/task-update-data.interface';
import { ITask } from '../interfaces/task.interface';
import { ITasksState } from '../interfaces/tasks-state.interface';

@Injectable()
export class TasksService implements IDataService<ITasksState> {
  private readonly _state = new BehaviorSubject<ITasksState>({
    tasks: [],
    tasksPagination: { nextPage: null, prevPage: null },
    tasksFetchingStatus: RequestStatus.Idle,
    currentTask: null,
    currentTaskFetchingStatus: RequestStatus.Idle
  });

  public readonly state$ = this._state.asObservable();

  public get state(): ITasksState {
    return this._state.value;
  }

  public constructor(
    @Inject(CONFIG) private readonly appConfig: typeof config,
    private readonly httpClient: HttpClient
  ) {}

  public getTasks(page: number): Observable<Array<ITask>> {
    const params = convertObjectToHttpParams({
      page,
      limit: this.appConfig.recordsPerPage
    });

    this.setState({ tasksFetchingStatus: RequestStatus.Pending });

    return this.httpClient
      .get<IServerPaginationResponse<ITask>>(`${this.appConfig.env.apiUrl}/tasks`, {
        params
      })
      .pipe(
        tap(res => this.putFetchedTasksToState(res)),
        pluck('data'),
        catchError((error: HttpErrorResponse) => this.putTasksFetchingErrorToState(error))
      );
  }

  private putFetchedTasksToState(res: IServerPaginationResponse<ITask>): void {
    const tasksPagination: IPaginationState = {
      nextPage: res.page < res.pageCount ? res.page + 1 : null,
      prevPage: res.page > 1 ? res.page - 1 : null
    };

    this.setState({
      tasks: res.data,
      tasksPagination,
      tasksFetchingStatus: RequestStatus.Success
    });
  }

  private putTasksFetchingErrorToState(error: HttpErrorResponse): Observable<never> {
    this.setState({ tasksFetchingStatus: RequestStatus.Error });

    return throwError(error);
  }

  public patchTask(data: ITaskUpdateData, taskId: string): Observable<ITask> {
    return this.httpClient
      .patch<ITask>(`${this.appConfig.env.apiUrl}/tasks/${taskId}`, data)
      .pipe(tap(task => this.patchFetchedTask(task)));
  }

  private patchFetchedTask(patchedTask: ITask): void {
    const tasks = this.state.tasks.map(task =>
      task.id === patchedTask.id ? { ...task, ...patchedTask } : task
    );

    const currentTask =
      this.state.currentTask && this.state.currentTask.id === patchedTask.id
        ? { ...this.state.currentTask, ...patchedTask }
        : this.state.currentTask;

    this.setState({ tasks, currentTask });
  }

  public getTask(taskId: string): Observable<ITask> {
    const cachedTask =
      this.state.currentTask && this.state.currentTask.id === taskId
        ? this.state.currentTask
        : this.state.tasks.find(task => task.id === taskId);

    if (cachedTask) {
      return of(cachedTask).pipe(tap(task => this.handleTaskFetchingSuccess(task)));
    }

    this.setState({ currentTaskFetchingStatus: RequestStatus.Pending });

    return this.httpClient.get<ITask>(`${this.appConfig.env.apiUrl}/tasks/${taskId}`).pipe(
      tap(task => this.handleTaskFetchingSuccess(task)),
      catchError((error: HttpErrorResponse) => this.handleTaskFetchingError(error))
    );
  }

  private handleTaskFetchingSuccess(task: ITask): void {
    this.setState({ currentTask: task, currentTaskFetchingStatus: RequestStatus.Success });
  }

  private handleTaskFetchingError(error: HttpErrorResponse): Observable<never> {
    const requestStatus = error.status === 404 ? RequestStatus.NotFound : RequestStatus.Error;

    this.setState({ currentTaskFetchingStatus: requestStatus });

    return throwError(error);
  }

  public deleteTask(taskId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.appConfig.env.apiUrl}/tasks/${taskId}`)
      .pipe(tap(() => this.deleteFetchedTask(taskId)));
  }

  private deleteFetchedTask(deletedTaskId: string): void {
    const tasks = this.state.tasks.filter(task => task.id !== deletedTaskId);

    const currentTask =
      this.state.currentTask && this.state.currentTask.id === deletedTaskId
        ? null
        : this.state.currentTask;

    this.setState({ tasks, currentTask });
  }

  public createTask(data: ITaskCreationData): Observable<ITask> {
    return this.httpClient
      .post<ITask>(`${this.appConfig.env.apiUrl}/tasks`, data)
      .pipe(tap(task => this.putCreatedTaskToState(task)));
  }

  private putCreatedTaskToState(createdTask: ITask): void {
    this.setState({ tasks: [createdTask, ...this.state.tasks] });
  }

  private setState(data: Partial<ITasksState>): void {
    this._state.next({ ...this.state, ...data });
  }
}
