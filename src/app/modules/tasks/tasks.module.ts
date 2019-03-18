import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

@NgModule({
  declarations: [TasksListComponent, NewTaskComponent, TaskDetailsComponent, EditTaskComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule
  ]
})
export class TasksModule { }
