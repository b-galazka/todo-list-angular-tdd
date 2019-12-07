import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

import { AppTitleService } from 'src/app/core/services/app-title.service';
import { TasksService } from 'src/app/modules/tasks/services/tasks.service';
import { ITask } from '../../interfaces/task.interface';
import { AbstractTasksPageComponent } from '../shared/abstracts/abstract-tasks-page.component';
import { ITasksParams } from './tasks-list.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './tasks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListComponent extends AbstractTasksPageComponent implements OnInit {
  public constructor(
    public readonly tasksService: TasksService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly appTitleService: AppTitleService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.route.params
      .pipe(
        filter((params: ITasksParams) => this.validPageNumberGuard(params)),
        tap((params: ITasksParams) => this.setPageTitle(params))
      )
      .subscribe((params: ITasksParams) => this.fetchTasks(params));
  }

  private fetchTasks({ page }: ITasksParams): void {
    this.tasksService
      .getTasks(+page)
      .pipe(filter(tasks => tasks.length === 0 && +page > 1))
      .subscribe(() => this.redirectToFirstPage());
  }

  private validPageNumberGuard({ page }: ITasksParams): boolean {
    const isPageNumberValid = Number.isInteger(+page) && +page >= 1;

    if (!isPageNumberValid) {
      this.redirectToFirstPage();
    }

    return isPageNumberValid;
  }

  private setPageTitle({ page }: ITasksParams): void {
    this.appTitleService.setPageTitle(`page ${page}`);
  }

  private redirectToFirstPage(): void {
    this.router.navigate(['/tasks/1']);
  }

  public trackTasks(task: ITask): number {
    return task.id;
  }
}
