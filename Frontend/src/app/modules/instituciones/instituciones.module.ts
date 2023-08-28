import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { RegistrarInstitucionComponent } from './registrar-institucion/registrar-institucion.component';
import { EditarInstitucionComponent } from './editar-institucion/editar-institucion.component';
import { ListarInstitucionComponent } from './listar-institucion/listar-institucion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
    declarations: [
        RegistrarInstitucionComponent,
        EditarInstitucionComponent,
        ListarInstitucionComponent
    ],
    imports: [
        CommonModule,
        InstitucionesRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule
    ]
})
export class InstitucionesModule { }
