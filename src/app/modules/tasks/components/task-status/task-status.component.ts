import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITask, TaskStatus } from 'src/app/core/models/task.model';

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
