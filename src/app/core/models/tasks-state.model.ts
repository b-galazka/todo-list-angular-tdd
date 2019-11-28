import { RequestStatus } from './server-request.model';
import { ITask } from './task.model';

export interface IPaginationState {
  prevPage: number;
  nextPage: number;
}

export interface ITasksState {
  tasks: Array<ITask>;
  tasksPagination: IPaginationState;
  tasksFetchingStatus: RequestStatus;
  currentTask: ITask;
  currentTaskFetchingStatus: RequestStatus;
}
