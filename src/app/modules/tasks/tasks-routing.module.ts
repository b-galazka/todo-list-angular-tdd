import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentLayoutComponent } from 'src/app/shared/layouts/content-layout/content-layout.component';

import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';

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
export class TasksRoutingModule {}
