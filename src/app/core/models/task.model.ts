export enum TaskStatus {
  New = 'new',
  InProgress = 'in progress',
  Finished = 'finished'
}

export interface ITask {
  name: string;
  description: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
}
