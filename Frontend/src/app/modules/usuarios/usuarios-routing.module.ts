import { AuthGuard } from '@/app/core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { EditarComponent } from './editar/editar.component';

const routes: Routes = [
  {
    path: 'registrar',
    component: RegistrarComponent,
    canActivate: [AuthGuard], // Proteger la ruta con el guard de ruta
    data: {
      requiredRole: 'ADMIN', // Especificar el rol requerido para acceder a la ruta
    },
    title: 'Usuarios',
  },
  {
    path: 'editar/:id',
    component: EditarComponent,
    canActivate: [AuthGuard], // Proteger la ruta con el guard de ruta
    data: {
      requiredRole: 'ADMIN', // Especificar el rol requerido para acceder a la ruta
    },
    title: 'Usuarios',
  },
  {
    path: 'listar',
    component: ListarComponent,
    canActivate: [AuthGuard], // Proteger la ruta con el guard de ruta
    data: {
      requiredRole: 'ADMIN', // Especificar el rol requerido para acceder a la ruta
    },
    title: 'Usuarios',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
