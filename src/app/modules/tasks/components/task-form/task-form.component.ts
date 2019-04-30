import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskStatus, ITask, ITaskCreationData } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {

  public readonly TaskStatus = TaskStatus;

  @Input() public existingTask: ITask;
  @Input() public pending = false;
  @Output() public submitted = new EventEmitter<ITaskCreationData>();

  public form: FormGroup;

  public constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      name: [
        this.existingTask ? this.existingTask.name : '',
        [Validators.required, Validators.maxLength(120)]
      ],
      description: [this.existingTask ? this.existingTask.description : '', Validators.required],
      status: [this.existingTask ? this.existingTask.status : TaskStatus.New, Validators.required]
    });
  }

  public submitForm(): void {
    if (this.validateForm()) {
      this.submitted.emit(this.form.value);
    }
  }

  private validateForm(): boolean {
    Object.values(this.form.controls).forEach((formControl) => {
      formControl.updateValueAndValidity();
      formControl.markAsTouched();
    });

    return this.form.valid;
  }
}
