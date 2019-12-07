import { TaskStatus } from '../enums/task-status.enum';

export interface ITaskCreationData {
  name: string;
  description: string;
  status?: TaskStatus;
}
