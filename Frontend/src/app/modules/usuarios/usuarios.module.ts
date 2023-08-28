import { SharedModule } from "@/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ListarComponent } from "./listar/listar.component";
import { RegistrarComponent } from "./registrar/registrar.component";
import { UsuariosRoutingModule } from "./usuarios-routing.module";
import { EditarComponent } from './editar/editar.component';



@NgModule({
  declarations: [
    ListarComponent,
    RegistrarComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class UsuariosModule { }
