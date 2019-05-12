import { Router } from '@angular/router';
import { ViewChild, HostListener } from '@angular/core';

import { ITask } from 'src/app/core/models/task.model';
import { ICanBeDeactivated } from 'src/app/core/models/can-be-deactivated.model';
import { TaskFormComponent } from '../../../components/task-form/task-form.component';
import { AbstractTasksPageComponent } from './abstract-tasks-page.component';

export abstract class AbstractTaskFormPageComponent
  extends AbstractTasksPageComponent
  implements ICanBeDeactivated {

  private _taskFormComponentRef: TaskFormComponent;

  public constructor(private readonly router: Router) {
    super();
  }

  @ViewChild(TaskFormComponent)
  public set taskFormComponentRef(componentRef: TaskFormComponent) {
    this._taskFormComponentRef = componentRef;
  }

  @HostListener('window:beforeunload')
  public canBeDeactivated(): boolean {
    return this._taskFormComponentRef.form.pristine || confirm('Are you sure you want to leave?');
  }

  protected readonly handleRequestSuccess = (task: ITask): void => {
    this._taskFormComponentRef.form.markAsPristine();
    this.router.navigate(['/tasks/details', task.id]);
  }

  protected readonly handleRequestFailure = (): void => {
    this.isPending$.next(false);
  }
}
