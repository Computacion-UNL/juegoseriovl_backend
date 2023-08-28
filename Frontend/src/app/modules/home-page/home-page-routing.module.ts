import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'usuarios',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
          ),
        data: {
          title: 'Usuarios',
        },
      },
    ],
  },
  {
    path: 'casos',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/casos/casos.module').then((m) => m.CasosModule),
        data: {
          title: 'Casos',
        },
      },
    ],
  },
  {
    path: 'institucion',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/instituciones/instituciones.module').then(
            (m) => m.InstitucionesModule
            ),
        data: {
          title: 'Instituciones',
        },
      },
    ],
  },
  {
    path: 'dece',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/dece/dece.module').then((m) => 
          m.DeceModule),
        data: {
          title: 'Dece',
        },
      },
    ],
  },
  {
    path: 'docente',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/docentes/docentes.module').then((m) => 
          m.DocentesModule),
        data: {
          title: 'Docente',
        },
      },
    ],
  },
  {
    path: 'estudiante',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/estudiantes/estudiantes.module').then((m) => 
          m.EstudiantesModule),
        data: {
          title: 'Estudiantes',
        },
      },
    ],
  },
  {
    path: 'test/estudiante',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/test-estudiante/test-estudiante.module').then((m) => 
          m.TestEstudianteModule),
        data: {
          title: 'Test Imágenes',
        },
      },
    ],
  },
  {
    path: 'test/question',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/test-question/test-question.module').then((m) => 
          m.TestQuestionModule),
        data: {
          title: 'Test Preguntas',
        },
      },
    ],
  },
  {
    path: 'test',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/test-docente/test-docente.module').then((m) => 
          m.TestDocenteModule),
        data: {
          title: 'Test Docente',
        },
      },
    ],
  },
  {
    path: 'caso/estudiante',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/caso-test-estudiante/caso-test-estudiante.module').then((m) => 
          m.CasoTestEstudianteModule),
        data: {
          title: 'Test Estudiantes',
        },
      },
    ],
  },
  {
    path: 'caso/docente',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/caso-test-docente/caso-test-docente.module').then((m) => 
          m.CasoTestDocenteModule),
        data: {
          title: 'Test Docentes',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
