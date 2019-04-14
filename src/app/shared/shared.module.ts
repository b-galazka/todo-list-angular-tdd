import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContentLayoutComponent, TextInputComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule,
    TextInputComponent
  ]
})
export class SharedModule { }
