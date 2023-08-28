import { AuthService } from '@/app/shared/services/api/auth.service';
import { JwtService } from '@/app/shared/services/utils/jwt.service';
import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export const AuthGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService); // Reemplaza "AuthService" con tu servicio de autenticación
  const router = inject(Router);

  try {
    //const token = cookieService.check('token')
    const requiredRole = route.data['requiredRole']; // Obtener el rol requerido para la ruta
    const userRole = authService.getUserRole(); // Obtener el rol del usuario desde tu servicio de autenticación
      if (requiredRole.includes(userRole) ) {
        return true;
      }
      router.navigate(['/']); // Reemplaza "/unauthorized" con la ruta de tu página de acceso no autorizado
      return false;
    
  } catch (e) {
    console.log(e);
    router.navigate(['auth/login']); // Reemplaza "/login" con la ruta de tu página de inicio de sesión
    return false;
  }
};
