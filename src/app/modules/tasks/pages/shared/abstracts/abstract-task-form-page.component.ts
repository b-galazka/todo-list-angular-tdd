import { Router } from '@angular/router';
import { ITask } from 'src/app/core/models/task.model';
import { ICanBeDeactivated } from 'src/app/core/models/can-be-deactivated.model';
import { TaskFormComponent } from '../../../components/task-form/task-form.component';
import { ViewChild, HostListener } from '@angular/core';

export abstract class AbstractTaskFormPageComponent implements ICanBeDeactivated {

  public isPending = false;
  private _taskFormComponentRef: TaskFormComponent;

  public constructor(private readonly router: Router) { }

  @ViewChild(TaskFormComponent)
  public set taskFormComponentRef(componentRef: TaskFormComponent) {
    this._taskFormComponentRef = componentRef;
  }

  @HostListener('window:beforeunload')
  public canBeDeactivated(): boolean {
    return this._taskFormComponentRef.form.pristine || confirm('Are you sure you want to leave?');
  }

  protected readonly handleRequestSuccess = (task: ITask): void => {
    this.router.navigate(['/tasks/details', task.id]);
  }

  protected readonly handleRequestFailure = (): void => {
    this.isPending = false;
  }
}
