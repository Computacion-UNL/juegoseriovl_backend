import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from '@/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path:'listar',
    component: ListarComponent,
    canActivate: [AuthGuard], 
    data: {
      requiredRole: 'DECE', // Especificar el rol requerido para acceder a la ruta
    },
    title: 'Casos',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasoTestEstudianteRoutingModule { }
