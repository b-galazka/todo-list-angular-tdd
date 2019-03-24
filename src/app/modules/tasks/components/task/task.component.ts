import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ITask } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

  @Input() public task: ITask;
}
