import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';
import { NotFoundLayoutComponent } from './layouts/not-found-layout/not-found-layout.component';

@NgModule({
  declarations: [ContentLayoutComponent, NotFoundLayoutComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
