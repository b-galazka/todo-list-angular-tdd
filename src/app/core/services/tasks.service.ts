import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
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
    tasksFetchingStatus: RequestStatus.Idle
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

  private setState(data: Partial<ITasksState>): void {
    this._state.next({ ...this.state, ...data });
  }
}
