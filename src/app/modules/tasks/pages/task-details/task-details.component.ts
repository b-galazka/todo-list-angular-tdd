import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WINDOW } from 'src/app/core/injection-tokens/window.token';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { AbstractTasksPageComponent } from '../shared/abstracts/abstract-tasks-page.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './task-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailsComponent extends AbstractTasksPageComponent implements OnInit {
  public constructor(
    public readonly tasksService: TasksService,
    @Inject(WINDOW) private readonly window: Window,
    private readonly route: ActivatedRoute,
    private readonly appTitleService: AppTitleService,
    private readonly router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.appTitleService.setPageTitle('task details');

    this.tasksService.getTask(taskId!).subscribe(task => {
      this.appTitleService.setPageTitle(`details of "${task.name}"`);
    });
  }

  public deleteTask(): void {
    if (!this.window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.isPending$.next(true);

    this.tasksService.deleteTask(this.tasksService.state.currentTask!.id).subscribe(() => {
      this.router.navigate(['/tasks/1']);
    });
  }
}
