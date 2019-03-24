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

  public constructor(
    private readonly route: ActivatedRoute,
    public readonly tasksService: TasksService
  ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(this.fetchTasks);
  }

  private readonly fetchTasks = ({ page }: ITasksParams): void => {
    this.tasksService.getTasks(page).subscribe();
  }
}
