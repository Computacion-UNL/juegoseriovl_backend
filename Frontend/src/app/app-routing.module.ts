import { HomeComponent } from './modules/home-page/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from './core/guards/session.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    data: { title: 'Login' },
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [SessionGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/home-page/home-page.module').then(
            (m) => m.HomePageModule
          ),
      },
    ],
    title: 'Home',
  },
  // Rutas desconocidas
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
