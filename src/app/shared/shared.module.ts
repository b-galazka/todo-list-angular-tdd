import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TextInputComponent } from './components/text-input/text-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextareaComponent } from './components/textarea/textarea.component';
import { SelectComponent } from './components/select/select.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';

import {
  FormFieldValidationErrorComponent
} from './components/form-field-validation-error/form-field-validation-error.component';

@NgModule({
  declarations: [
    ContentLayoutComponent,
    TextInputComponent,
    TextareaComponent,
    SelectComponent,
    FormFieldValidationErrorComponent
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
    SelectComponent
  ]
})
export class SharedModule { }
