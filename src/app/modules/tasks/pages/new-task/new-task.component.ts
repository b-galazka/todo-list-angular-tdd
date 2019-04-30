import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { ITaskCreationData, ITask } from 'src/app/core/models/task.model';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  public isPending = false;

  public constructor(
    private readonly appTitleService: AppTitleService,
    private readonly tasksService: TasksService,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.appTitleService.setPageTitle('new task');
  }

  public createTask(taskData: ITaskCreationData): void {

    this.isPending = true;

    this.tasksService.createTask(taskData).subscribe(
      this.handleTaskCreationSuccess,
      this.handleTaskCreationFailure
    );
  }

  private readonly handleTaskCreationSuccess = (createdTask: ITask): void => {
    this.router.navigate(['/tasks/details', createdTask.id]);
  }

  private readonly handleTaskCreationFailure = (): void => {
    this.isPending = false;
  }
}
