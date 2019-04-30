import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';

import {
  ContentLayoutComponent
} from 'src/app/shared/layouts/content-layout/content-layout.component';

import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';

const routes: Routes = [

  {
    path: 'tasks',
    component: ContentLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/tasks/1' },
      { path: 'edit/:taskId', component: EditTaskComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'details/:taskId', component: TaskDetailsComponent },
      { path: 'new', component: NewTaskComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: ':page', component: TasksListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
