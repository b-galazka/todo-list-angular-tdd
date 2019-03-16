import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';

import {
  ContentLayoutComponent
} from 'src/app/shared/layouts/content-layout/content-layout.component';

const routes: Routes = [

  {
    path: 'tasks',
    component: ContentLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/tasks/1' },
      { path: ':page', component: TasksListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
