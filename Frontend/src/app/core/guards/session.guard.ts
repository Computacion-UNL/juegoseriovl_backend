import { AuthService } from '@/app/shared/services/api/auth.service';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const SessionGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  //export const SessionGuard =():boolean =>{

  const router = inject(Router);
  const cookieService = inject(CookieService);

  try {
    const token = cookieService.check('token');

    if (!token) {
      cookieService.deleteAll();
      router.navigate(['auth'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    return token;
  } catch (e) {
    return false;
  }
};
