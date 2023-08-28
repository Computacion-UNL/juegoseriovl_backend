import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class InjectSessionInterceptorInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    try {
      const token = this.cookieService.get('token')
      
      let newRequest = request
      newRequest = request.clone(
        {
          setHeaders: {
            authorization: `Bearer ${token}`,
            CUSTOM_HEADER: 'SeriusGameAdministrator'
          }
        }
      )

      return next.handle(newRequest);

    } catch (e) {
      console.log('Error al autenticarse', e)
      return next.handle(request);
    }
  }
}
