
import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterTablesPipe } from './pipes/filter-tables.pipe';

@NgModule({

  declarations: [
    FilterTablesPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    FilterTablesPipe
  ]
})
export class SharedModule { }
