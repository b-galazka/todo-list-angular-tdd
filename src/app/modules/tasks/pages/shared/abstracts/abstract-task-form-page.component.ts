import { Router } from '@angular/router';
import { ViewChild, HostListener } from '@angular/core';

import { ITask } from 'src/app/core/models/task.model';
import { ICanBeDeactivated } from 'src/app/core/models/can-be-deactivated.model';
import { TaskFormComponent } from '../../../components/task-form/task-form.component';
import { AbstractTasksPageComponent } from './abstract-tasks-page.component';

export abstract class AbstractTaskFormPageComponent
  extends AbstractTasksPageComponent
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

  protected readonly handleRequestSuccess = (task: ITask): void => {
    this.taskFormComponentRef.form.markAsPristine();
    this.router.navigate(['/tasks/details', task.id]);
  }

  protected readonly handleRequestFailure = (): void => {
    this.isPending$.next(false);
  }
}
