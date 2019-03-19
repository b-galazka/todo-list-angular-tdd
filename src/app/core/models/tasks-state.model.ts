import { ITask } from './task.model';
import { IPagination } from './server-response.model';
import { RequestStatus } from './server-request.model';

export interface ITasksState {
  tasks: Array<ITask>;
  tasksPagination: IPagination;
  tasksFetchingStatus: RequestStatus;
}
