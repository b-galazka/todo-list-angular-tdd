import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITask, ITaskCreationData, TaskStatus } from 'src/app/core/models/task.model';

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
    this.buildForm();

    if (this.existingTask) {
      this.setFormValueToExistingTask();
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(120)]],
      description: [null, Validators.required],
      status: [TaskStatus.New, Validators.required]
    });
  }

  private setFormValueToExistingTask(): void {
    this.form.patchValue(this.existingTask, { emitEvent: false });
  }

  public submitForm(): void {
    if (this.validateForm()) {
      this.submitted.emit(this.form.value);
    }
  }

  private validateForm(): boolean {
    Object.values(this.form.controls).forEach(formControl => {
      formControl.updateValueAndValidity();
      formControl.markAsTouched();
    });

    return this.form.valid;
  }
}
