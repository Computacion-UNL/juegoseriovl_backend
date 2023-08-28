import { TokenInformation } from '@/app/core/interfaces/interface-token';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieOptions, CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  // Injection of JwtHelperService

  getToken = this.cookieService.get('token');
  cookieOptions: CookieOptions = {
    sameSite: 'None', // Opciones: 'None', 'Strict', 'Lax'
    secure: true, // Asegurarse de que la cookie solo se envíe a través de HTTPS
  };

  constructor(
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) {}

  // verifies if the token is expired
  public isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  public destroyToken(): void {
    localStorage.removeItem('token');
  }

  // returns the expiration date of the token
  getTokenExpirationDate(token: string): Date | number {
    const decodedToken = this.jwtHelper.decodeToken(token);
    const exp = decodedToken && decodedToken.exp;

    if (exp) {
      const expDate = new Date(exp * 1000)
      return expDate;
    }

    return 0;
  }

  // returns the token information
  public getTokenInformation(token: string): TokenInformation | null {
    const decoded = this.jwtHelper.decodeToken(token);

    if (!decoded.exp) {
      return null;
    }
    const dateNow = new Date();
    const expiresAt = this.getTokenExpirationDate(token);
    if (!expiresAt) {
      return null;
    }

    return {
      exp: decoded.exp,
      iat: decoded.iat,
      name: decoded.name,
      role: decoded.role,
      user: decoded.user,
      institution: decoded.institution,
      dateNow: dateNow,
    };
  }

  setCookieAccess(token: string) {
    const exp = this.getTokenExpirationDate(token);
    this.cookieService.set('token', token, new Date(exp), '/','',true,'Strict');
  }

  isLoggedIn() {
    return this.getToken && !this.isTokenExpired(this.getToken);
  }
}
