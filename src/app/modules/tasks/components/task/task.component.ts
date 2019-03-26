import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ITask, TaskStatus } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

  public readonly TaskStatus = TaskStatus;

  @Input() public task: ITask;
}
