import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ITasksParams } from './tasks-list.model';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  public readonly RequestStatus = RequestStatus;

  public constructor(
    public readonly tasksService: TasksService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(this.fetchTasks);
  }

  private readonly fetchTasks = ({ page }: ITasksParams): void => {

    if (!Number.isInteger(+page) || page < 1) {
      return this.redirectToFirstPage();
    }

    this.tasksService
      .getTasks(+page)
      .pipe(filter(tasks => tasks.length === 0 && page > 1))
      .subscribe(this.redirectToFirstPage);
  }

  private readonly redirectToFirstPage = (): void => {
    this.router.navigate(['/tasks/1']);
  }
}
