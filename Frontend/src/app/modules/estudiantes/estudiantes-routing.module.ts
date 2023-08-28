import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarComponent } from './editar/editar.component';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@/app/core/guards/auth.guard';

const routes: Routes = [

  {
    path: 'listar',
    component: ListarComponent,
    canActivate: [AuthGuard], 
    data: {
      requiredRole: 'ADMIN', // Especificar el rol requerido para acceder a la ruta
    },
    title: 'Estudiante',
  },
  {
    path: 'editar/:id',
    component: EditarComponent,
    canActivate: [AuthGuard], 
    data: {
      requiredRole: 'ADMIN', // Especificar el rol requerido para acceder a la ruta
    },
    title: 'Estudiante',
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudiantesRoutingModule { }
