import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ITask, TaskStatus } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/core/services/tasks.service';

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

  public constructor(
    private readonly tasksService: TasksService
  ) { }

  public changeTaskStatus(): void {

    this.isPending = true;

    const status = (this.task.status === TaskStatus.New) ?
      TaskStatus.InProgress :
      TaskStatus.Finished;

    this.tasksService.patchTask({ status }, this.task.id).subscribe(() => {
      this.isPending = false;
    });
  }
}
