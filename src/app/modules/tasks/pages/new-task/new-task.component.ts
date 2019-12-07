import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WINDOW } from 'src/app/core/injection-tokens/window.token';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { ITaskCreationData } from '../../interfaces/task-creation-data.interface';
import { AbstractTaskFormPageComponent } from '../shared/abstracts/abstract-task-form-page.component';

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
    @Inject(WINDOW) window: Window,
    router: Router
  ) {
    super(router, window);
  }

  public ngOnInit(): void {
    this.appTitleService.setPageTitle('new task');
  }

  public createTask(taskData: ITaskCreationData): void {
    this.isPending$.next(true);

    this.tasksService.createTask(taskData).subscribe(
      task => this.handleRequestSuccess(task),
      () => this.handleRequestFailure()
    );
  }
}
