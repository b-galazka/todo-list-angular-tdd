import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TasksService } from 'src/app/core/services/tasks.service';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { TaskStatus } from 'src/app/core/models/task.model';
import { AbstractTasksPageComponent } from '../shared/abstracts/abstract-tasks-page.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './task-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailsComponent extends AbstractTasksPageComponent implements OnInit {

  public readonly RequestStatus = RequestStatus;
  public readonly TaskStatus = TaskStatus;

  public constructor(
    public readonly tasksService: TasksService,
    private readonly route: ActivatedRoute,
    private readonly appTitleService: AppTitleService,
    private readonly router: Router
  ) {
    super();
  }

  public ngOnInit(): void {

    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.appTitleService.setPageTitle('task details');

    this.tasksService.getTask(+taskId).subscribe((task) => {
      this.appTitleService.setPageTitle(`details of "${task.name}"`);
    });
  }

  public deleteTask(): void {

    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.isPending$.next(true);

    this.tasksService.deleteTask(this.tasksService.state.currentTask.id).subscribe(() => {
      this.router.navigate(['/tasks/1']);
    });
  }
}
