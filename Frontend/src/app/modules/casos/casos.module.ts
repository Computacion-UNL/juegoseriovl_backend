import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasosRoutingModule } from './casos-routing.module';
import { RegistrarComponent } from './registrar/registrar.component';
import { ListarComponent } from './listar/listar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteComponent } from './reporte/reporte.component';
import { RegistroDocenteComponent } from './registroDocente/registroDocente.component';
import { SharedModule } from "../../shared/shared.module";
import { ListarDocenteComponent } from './listar-docente/listar-docente.component';
import { EditarComponent } from './editar/editar.component';

@NgModule({
    declarations: [
        RegistrarComponent,
        RegistroDocenteComponent,
        ListarComponent,
        ReporteComponent,
        ListarDocenteComponent,
        EditarComponent
    ],
    imports: [
        CommonModule,
        CasosRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule
    ]
})
export class CasosModule { }
