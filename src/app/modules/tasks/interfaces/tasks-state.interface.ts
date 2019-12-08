import { RequestStatus } from 'src/app/shared/enums/request-status.enum';
import { IPaginationState } from 'src/app/shared/interfaces/pagination-state.interface';
import { ITask } from './task.interface';

export interface ITasksState {
  tasks: Array<ITask>;
  tasksPagination: IPaginationState;
  tasksFetchingStatus: RequestStatus;
  currentTask: ITask | null;
  currentTaskFetchingStatus: RequestStatus;
}
