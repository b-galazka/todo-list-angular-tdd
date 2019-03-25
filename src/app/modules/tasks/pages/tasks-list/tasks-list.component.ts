import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ITasksParams } from './tasks-list.model';
import { RequestStatus } from 'src/app/core/models/server-request.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  public readonly RequestStatus = RequestStatus;

  public isInvalidPageNumberProvided = false;

  public constructor(
    private readonly route: ActivatedRoute,
    public readonly tasksService: TasksService
  ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(this.fetchTasks);
  }

  private readonly fetchTasks = ({ page }: ITasksParams): void => {

    // TODO: redirect to first page
    this.isInvalidPageNumberProvided = !Number.isInteger(+page) || page < 1;

    if (this.isInvalidPageNumberProvided) {
      return;
    }

    // TODO: if no tasks found and page > 1 then redirect to first page
    this.tasksService.getTasks(+page).subscribe();
  }
}
