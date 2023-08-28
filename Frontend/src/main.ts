import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment.prod';

if (environment) { // Verificar si es un entorno de producción
  enableProdMode(); // Habilitar el modo de producción
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
