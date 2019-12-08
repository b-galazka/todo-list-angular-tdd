import { TaskStatus } from '../enums/task-status.enum';

export interface ITask {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  status: TaskStatus;
}
