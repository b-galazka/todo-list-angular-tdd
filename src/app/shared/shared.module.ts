import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextareaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [ContentLayoutComponent, TextInputComponent, TextareaComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    TextInputComponent,
    TextareaComponent,
    FormsModule
  ]
})
export class SharedModule { }
