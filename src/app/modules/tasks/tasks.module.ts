import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskStatusComponent } from './components/task-status/task-status.component';
import { TaskComponent } from './components/task/task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TasksService } from './services/tasks.service';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
  declarations: [
    TasksListComponent,
    NewTaskComponent,
    TaskDetailsComponent,
    EditTaskComponent,
    TaskComponent,
    TaskFormComponent,
    TaskStatusComponent
  ],
  imports: [CommonModule, TasksRoutingModule, SharedModule],
  providers: [TasksService]
})
export class TasksModule {}
