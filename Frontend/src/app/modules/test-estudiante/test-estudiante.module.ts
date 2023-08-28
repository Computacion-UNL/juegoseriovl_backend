import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestEstudianteRoutingModule } from './test-estudiante-routing.module';
import { RegistrarComponent } from './registrar/registrar.component';
import { EditarComponent } from './editar/editar.component';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';


@NgModule({
  declarations: [
    RegistrarComponent,
    EditarComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    TestEstudianteRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
    ]
})
export class TestEstudianteModule { }
