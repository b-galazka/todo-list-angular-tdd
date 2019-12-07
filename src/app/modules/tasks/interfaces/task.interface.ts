import { TaskStatus } from '../enums/task-status.enum';

export interface ITask {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  status: TaskStatus;
}
