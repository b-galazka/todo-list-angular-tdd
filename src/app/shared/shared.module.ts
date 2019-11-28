import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { SelectComponent } from './components/select/select.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';

@NgModule({
  declarations: [
    ContentLayoutComponent,
    TextInputComponent,
    TextareaComponent,
    SelectComponent,
    FormFieldComponent
  ],
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  exports: [
    ReactiveFormsModule,
    TextInputComponent,
    TextareaComponent,
    FormsModule,
    SelectComponent,
    FormFieldComponent
  ]
})
export class SharedModule {}
