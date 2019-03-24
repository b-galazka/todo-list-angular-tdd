import { BehaviorSubject } from 'rxjs';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { ITasksState } from 'src/app/core/models/tasks-state.model';

export class TasksServiceMock {

  private readonly _state = new BehaviorSubject<ITasksState>({
    tasks: [],
    tasksPagination: { next: null, prev: null },
    tasksFetchingStatus: RequestStatus.Idle
  });

  public readonly state$ = this._state.asObservable();

  public get state(): ITasksState {
    return this._state.value;
  }

  public getTasks(page: number): any { }

  public setState(data: Partial<ITasksState>): void {
    this._state.next({ ...this.state, ...data });
  }
}
