import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { IServerResponse, IPaginationParams } from '../models/server-response.model';
import { ITask } from '../models/task.model';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ITasksState, IPaginationState } from '../models/tasks-state.model';
import { RequestStatus } from '../models/server-request.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private static readonly RECORDS_PER_PAGE = 15;

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

  public constructor(private readonly httpClient: HttpClient) {}

  private static readonly mapServerReponseToData = <T>(response: IServerResponse<T>): T => {
    return response.data;
  }

  private static getPageNumber(paginationParams: IPaginationParams): number {

    if (!paginationParams) {
      return null;
    }

    return (paginationParams.offset + paginationParams.limit) / TasksService.RECORDS_PER_PAGE;
  }

  public getTasks(page: number): Observable<Array<ITask>> {

    const paramsObj = {
      offset: String((page - 1) * TasksService.RECORDS_PER_PAGE),
      limit: String(TasksService.RECORDS_PER_PAGE)
    };

    const params = new HttpParams({ fromObject: paramsObj });

    this.setState({ tasksFetchingStatus: RequestStatus.Pending });

    return this.httpClient
      .get<IServerResponse<Array<ITask>>>(`${environment.apiUrl}/tasks`, { params })
      .pipe(
        tap(this.handleTasksFetchingSuccess),
        map(TasksService.mapServerReponseToData),
        catchError(this.handleTasksFetchingError)
      );
  }

  private readonly handleTasksFetchingSuccess = (res: IServerResponse<Array<ITask>>): void => {

    const tasksPagination: IPaginationState = {
      nextPage: TasksService.getPageNumber(res.pagination.next),
      prevPage: TasksService.getPageNumber(res.pagination.prev)
    };

    this.setState({
      tasks: res.data,
      tasksPagination,
      tasksFetchingStatus: RequestStatus.Success
    });
  }

  private readonly handleTasksFetchingError = (error: HttpErrorResponse): Observable<never> => {

    this.setState({ tasksFetchingStatus: RequestStatus.Error });

    return throwError(error);
  }

  public patchTask(data: Partial<ITask>, taskId: number): Observable<ITask> {

    return this.httpClient
      .patch<IServerResponse<ITask>>(`${environment.apiUrl}/tasks/${taskId}`, { task: data })
      .pipe(
        map(TasksService.mapServerReponseToData),
        tap(this.patchFetchedTasks)
      );
  }

  private readonly patchFetchedTasks = (patchedTask: ITask): void => {

    const tasks = this.state.tasks.map(
      (task) => (task.id === patchedTask.id) ? ({ ...task, ...patchedTask }) : task
    );

    this.setState({ tasks });
  }

  public getTask(taskId: number): Observable<ITask> {

    const cachedTask = this.state.tasks.find(task => task.id === taskId);

    if (cachedTask) {
      return of(cachedTask).pipe(tap(this.handleTaskFetchingSuccess));
    }

    this.setState({ currentTaskFetchingStatus: RequestStatus.Pending });

    return this.httpClient
      .get<IServerResponse<ITask>>(`${environment.apiUrl}/tasks/${taskId}`)
      .pipe(
        map(TasksService.mapServerReponseToData),
        tap(this.handleTaskFetchingSuccess),
        catchError(this.handleTaskFetchingError)
      );
  }

  private readonly handleTaskFetchingSuccess = (task: ITask): void => {

    this.setState({ currentTask: task, currentTaskFetchingStatus: RequestStatus.Success });
  }

  private readonly handleTaskFetchingError = (error: HttpErrorResponse): Observable<never> => {

    this.setState({ currentTaskFetchingStatus: RequestStatus.Error });

    return throwError(error);
  }

  private setState(data: Partial<ITasksState>): void {
    this._state.next({ ...this.state, ...data });
  }
}
