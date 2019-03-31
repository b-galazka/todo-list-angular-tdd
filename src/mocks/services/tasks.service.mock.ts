import { BehaviorSubject, of } from 'rxjs';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { ITasksState } from 'src/app/core/models/tasks-state.model';
import { ITask } from 'src/app/core/models/task.model';

export class TasksServiceMock {

  private readonly _state = new BehaviorSubject<ITasksState>({
    tasks: [],
    tasksPagination: { nextPage: null, prevPage: null },
    tasksFetchingStatus: RequestStatus.Idle
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

  public patchTask(data: Partial<ITask>, taskId: number): any {
    return of();
  }
}
