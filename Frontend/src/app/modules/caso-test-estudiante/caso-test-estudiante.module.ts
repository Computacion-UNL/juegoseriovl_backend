import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasoTestEstudianteRoutingModule } from './caso-test-estudiante-routing.module';
import { ListarComponent } from './listar/listar.component';
import { SharedModule } from '@/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListarComponent],
  imports: [
    CommonModule,
    CasoTestEstudianteRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class CasoTestEstudianteModule {}
