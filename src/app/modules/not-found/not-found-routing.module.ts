import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import {
  NotFoundLayoutComponent
} from 'src/app/shared/layouts/not-found-layout/not-found-layout.component';

const routes: Routes = [

  {
    path: '**',
    component: NotFoundLayoutComponent,
    children: [
      { path: '', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotFoundRoutingModule { }
