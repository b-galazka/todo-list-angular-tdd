import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTaskComponent } from './new-task.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewTaskComponent,
        TaskFormComponent,
        TextInputComponent,
        TextareaComponent,
        SelectComponent
      ],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
