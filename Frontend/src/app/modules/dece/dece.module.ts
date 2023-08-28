import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeceRoutingModule } from './dece-routing.module';
import { SharedModule } from '@/app/shared/shared.module';
import { RegistrarComponent } from './registrar/registrar.component';
import { EditarComponent } from './editar/editar.component';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegistrarComponent,
    EditarComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    DeceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class DeceModule { }
