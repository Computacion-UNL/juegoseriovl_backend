import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { JwtService } from '../utils/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL = environment.api + '/api/1.0';

  constructor(
    private cookieService: CookieService,
    private jwtService: JwtService,
    private http: HttpClient,
    private route: Router
  ) {}

  private getUserOnly() {
    const cookie = this.cookieService.get('token');
    return this.jwtService.getTokenInformation(cookie);
  }

  getUserName() {
    return this.getUserOnly()?.name;
  }

  getUserRole() {
    return this.getUserOnly()?.role;
  }

  getUserId() {
    return this.getUserOnly()?.user;
  }

  getInstitution() {
    return this.getUserOnly()?.institution;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.URL}/auth/login`, { email, password });
  }

  logout() {
    this.cookieService.deleteAll();
    this.cookieService.delete('token','/');
    window.sessionStorage.clear();
    this.route.navigate(['auth/login'])
  }

  validateAddAdmin(body: any): Observable<any> {
    return this.http.post(`${this.URL}/auth/validate`, body);
  }

  //Funcion para enviar codigo al correo
  recoverPassword(body: any): Observable<any> {
    return this.http.post(`${this.URL}/auth/recovery`, body);
  }

  //Funcion para validar el codigo de recuperacion
  validateCode(body: any): Observable<any> {
    return this.http.post(`${this.URL}/auth/validate/recovery`, body);
  }

  //Funcion para cambiar la contraseña
  changePassword(body: any): Observable<any> {
    return this.http.post(`${this.URL}/auth/reset`, body);
  }
}
