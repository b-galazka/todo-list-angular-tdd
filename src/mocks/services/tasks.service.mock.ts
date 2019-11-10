import { BehaviorSubject, of } from 'rxjs';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { ITasksState } from 'src/app/core/models/tasks-state.model';
import { IDataService } from 'src/app/core/models/data.service.model';

export class TasksServiceMock implements IDataService<ITasksState> {

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

  public getTasks(): any {
    return of();
  }

  public setState(data: Partial<ITasksState>): void {
    this._state.next({ ...this.state, ...data });
  }

  public patchTask(): any {
    return of();
  }

  public getTask(): any {
    return of();
  }

  public deleteTask(): any {
    return of();
  }

  public createTask(): any {
    return of();
  }
}
