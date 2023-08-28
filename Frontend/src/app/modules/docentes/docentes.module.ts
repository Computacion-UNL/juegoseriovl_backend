import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentesRoutingModule } from './docentes-routing.module';
import { ListarComponent } from './listar/listar.component';
import { EditarComponent } from './editar/editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/shared/shared.module';


@NgModule({
  declarations: [
    ListarComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    DocentesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class DocentesModule { }
