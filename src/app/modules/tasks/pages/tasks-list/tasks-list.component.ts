import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ITasksParams } from './tasks-list.model';
import { RequestStatus } from 'src/app/core/models/server-request.model';
import { filter, tap } from 'rxjs/operators';
import { AppTitleService } from 'src/app/core/services/app-title.service';

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
    private readonly router: Router,
    private readonly appTitleService: AppTitleService
  ) { }

  public ngOnInit(): void {
    this.route.params
      .pipe(filter(this.validPageNumberGuard), tap(this.setPageTitle))
      .subscribe(this.fetchTasks);
  }

  private readonly fetchTasks = ({ page }: ITasksParams): void => {

    this.tasksService
      .getTasks(+page)
      .pipe(filter(tasks => tasks.length === 0 && page > 1))
      .subscribe(this.redirectToFirstPage);
  }

  private readonly validPageNumberGuard = ({ page }: ITasksParams): boolean => {

    const isPageNumberValid = Number.isInteger(+page) && page >= 1;

    if (!isPageNumberValid) {
      this.redirectToFirstPage();
    }

    return isPageNumberValid;
  }

  private readonly setPageTitle = ({ page }: ITasksParams): void => {
    this.appTitleService.setPageTitle(`page ${page}`);
  }

  private readonly redirectToFirstPage = (): void => {
    this.router.navigate(['/tasks/1']);
  }
}
