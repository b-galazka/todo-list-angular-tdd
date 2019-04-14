import { BehaviorSubject, of } from 'rxjs';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { ITasksState } from 'src/app/core/models/tasks-state.model';
import { ITaskUpdateData, ITaskCreationData } from 'src/app/core/models/task.model';
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

  public getTasks(page: number): any {
    return of();
  }

  public setState(data: Partial<ITasksState>): void {
    this._state.next({ ...this.state, ...data });
  }

  public patchTask(data: ITaskUpdateData, taskId: number): any {
    return of();
  }

  public getTask(taskId: number): any {
    return of();
  }

  public deleteTask(taskId: number): any {
    return of();
  }

  public createTask(data: ITaskCreationData): any {
    return of();
  }
}
