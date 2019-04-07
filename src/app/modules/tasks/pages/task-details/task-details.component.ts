import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { TaskStatus } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  public readonly RequestStatus = RequestStatus;
  public readonly TaskStatus = TaskStatus;

  public constructor(
    private readonly route: ActivatedRoute,
    public readonly tasksService: TasksService,
    private readonly appTitleService: AppTitleService
  ) {}

  public ngOnInit(): void {

    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.appTitleService.setPageTitle('task details');

    this.tasksService.getTask(+taskId).subscribe((task) => {
      this.appTitleService.setPageTitle(`details of "${task.name}"`);
    });
  }
}
