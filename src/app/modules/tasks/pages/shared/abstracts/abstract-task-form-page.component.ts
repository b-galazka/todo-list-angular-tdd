import { HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ICanBeDeactivated } from 'src/app/shared/interfaces/can-be-deactivated.interface';
import { TaskFormComponent } from '../../../components/task-form/task-form.component';
import { ITask } from '../../../interfaces/task.interface';
import { AbstractTasksPageComponent } from './abstract-tasks-page.component';

export abstract class AbstractTaskFormPageComponent extends AbstractTasksPageComponent
  implements ICanBeDeactivated {
  @ViewChild(TaskFormComponent, { static: false }) public taskFormComponentRef: TaskFormComponent;

  public isPending = false;

  public constructor(private readonly router: Router) {
    super();
  }

  @HostListener('window:beforeunload')
  public canBeDeactivated(): boolean {
    return this.taskFormComponentRef.form.pristine || confirm('Are you sure you want to leave?');
  }

  protected handleRequestSuccess(task: ITask): void {
    this.taskFormComponentRef.form.markAsPristine();
    this.router.navigate(['/tasks/details', task.id]);
  }

  protected handleRequestFailure(): void {
    this.isPending$.next(false);
  }
}
