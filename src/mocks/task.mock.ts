import { ITask, TaskStatus } from 'src/app/core/models/task.model';

export const taskMock: ITask = {
  name: 'task name',
  description: 'task description',
  id: 1,
  createdAt: '2019-03-19T19:52:38.955Z',
  updatedAt: '2019-03-19T19:52:38.955Z',
  status: TaskStatus.InProgress
};
