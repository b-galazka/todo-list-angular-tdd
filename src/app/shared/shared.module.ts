import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ContentLayoutComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
