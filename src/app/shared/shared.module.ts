import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TextInputComponent } from './components/text-input/text-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextareaComponent } from './components/textarea/textarea.component';
import { SelectComponent } from './components/select/select.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { FormFieldComponent } from './components/form-field/form-field.component';

@NgModule({
  declarations: [
    ContentLayoutComponent,
    TextInputComponent,
    TextareaComponent,
    SelectComponent,
    FormFieldComponent
  ],
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
    FormsModule,
    SelectComponent,
    FormFieldComponent
  ]
})
export class SharedModule { }
