import { TaskStatus } from 'src/app/modules/tasks/enums/task-status.enum';
import { ITask } from 'src/app/modules/tasks/interfaces/task.interface';

export const taskMock: ITask = {
  name: 'task name',
  description: 'task description',
  id: 'uuid',
  createdAt: '2019-03-19T19:52:38.955Z',
  updatedAt: '2019-03-19T13:12:38.955Z',
  status: TaskStatus.InProgress
};
