import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WINDOW } from 'src/app/core/injection-tokens/window.token';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { ITaskCreationData } from '../../interfaces/task-creation-data.interface';
import { AbstractTaskFormPageComponent } from '../shared/abstracts/abstract-task-form-page.component';

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
    @Inject(WINDOW) window: Window,
    router: Router
  ) {
    super(router, window);
  }

  public ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.appTitleService.setPageTitle('edit task');

    this.tasksService.getTask(taskId!).subscribe(task => {
      this.appTitleService.setPageTitle(`edit "${task.name}" task`);
    });
  }

  public updateTask(taskData: ITaskCreationData): void {
    this.isPending$.next(true);

    this.tasksService.patchTask(taskData, this.tasksService.state.currentTask!.id).subscribe(
      task => this.handleRequestSuccess(task),
      () => this.handleRequestFailure()
    );
  }
}
