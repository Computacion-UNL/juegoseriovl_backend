import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasoTestDocenteRoutingModule } from './caso-test-docente-routing.module';
import { ListarComponent } from './listar/listar.component';
import { SharedModule } from '@/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListarComponent],
  imports: [
    CommonModule,
    CasoTestDocenteRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class CasoTestDocenteModule {}
