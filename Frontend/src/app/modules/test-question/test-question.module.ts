import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestQuestionRoutingModule } from './test-question-routing.module';
import { ListarComponent } from './listar/listar.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { EditarComponent } from './editar/editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';


@NgModule({
  declarations: [
    ListarComponent,
    RegistrarComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    TestQuestionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class TestQuestionModule { }
