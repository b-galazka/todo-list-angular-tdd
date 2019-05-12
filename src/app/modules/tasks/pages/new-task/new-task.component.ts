import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ITaskCreationData } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/core/services/tasks.service';

import {
  AbstractTaskFormPageComponent
} from '../shared/abstracts/abstract-task-form-page.component';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './new-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskComponent extends AbstractTaskFormPageComponent implements OnInit {

  public constructor(
    private readonly appTitleService: AppTitleService,
    private readonly tasksService: TasksService,
    router: Router
  ) {
    super(router);
  }

  public ngOnInit(): void {
    this.appTitleService.setPageTitle('new task');
  }

  public createTask(taskData: ITaskCreationData): void {

    this.isPending$.next(true);

    this.tasksService.createTask(taskData).subscribe(
      this.handleRequestSuccess,
      this.handleRequestFailure
    );
  }
}
