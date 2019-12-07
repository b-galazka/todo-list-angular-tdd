import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { TaskStatus } from '../../enums/task-status.enum';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  public readonly TaskStatus = TaskStatus;

  public isPending = false;

  @Input() public task: ITask;

  public constructor(private readonly tasksService: TasksService) {}

  public changeTaskStatus(): void {
    this.isPending = true;

    const status =
      this.task.status === TaskStatus.New ? TaskStatus.InProgress : TaskStatus.Finished;

    this.tasksService.patchTask({ status }, this.task.id).subscribe(() => {
      this.isPending = false;
    });
  }
}
