import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  AbstractTaskFormPageComponent
} from '../shared/abstracts/abstract-task-form-page.component';

import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ITaskCreationData } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './edit-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTaskComponent extends AbstractTaskFormPageComponent implements OnInit {

  public constructor(
    public readonly tasksService: TasksService,
    private readonly appTitleService: AppTitleService,
    private readonly route: ActivatedRoute,
    router: Router
  ) {
    super(router);
  }

  public ngOnInit(): void {

    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.appTitleService.setPageTitle('edit task');

    this.tasksService.getTask(+taskId).subscribe((task) => {
      this.appTitleService.setPageTitle(`edit "${task.name}" task`);
    });
  }

  public updateTask(taskData: ITaskCreationData): void {

    this.isPending$.next(true);

    this.tasksService.patchTask(taskData, this.tasksService.state.currentTask.id).subscribe(
      this.handleRequestSuccess,
      this.handleRequestFailure
    );
  }
}
