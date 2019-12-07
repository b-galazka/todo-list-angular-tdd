import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskStatus } from '../../enums/task-status.enum';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskStatusComponent {
  public readonly TaskStatus = TaskStatus;

  @Input() public task: ITask;
}
