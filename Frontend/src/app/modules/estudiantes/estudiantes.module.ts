import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstudiantesRoutingModule } from './estudiantes-routing.module';
import { EditarComponent } from './editar/editar.component';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';


@NgModule({
  declarations: [
    EditarComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    EstudiantesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule

  ]
})
export class EstudiantesModule { }
