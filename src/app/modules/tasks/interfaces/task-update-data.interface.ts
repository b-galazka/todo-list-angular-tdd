import { TaskStatus } from '../enums/task-status.enum';

export interface ITaskUpdateData {
  name?: string;
  description?: string;
  status?: TaskStatus;
}
