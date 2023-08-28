import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private readonly URL = environment.api + '/api/1.0'

  constructor(
    private http: HttpClient
  ) { }

  createPersona(persona: any): Observable<any> {
    return this.http.post(`${this.URL}/person`, persona)
  }

  getAllPersona(): Observable<any> {
    return this.http.get(`${this.URL}/person`);
  }
  getPersona(id: any): Observable<any> {
    return this.http.get(`${this.URL}/person/${id}`);
  }

  updatePersona(id: any, persona: any): Observable<any> {
    return this.http.put(`${this.URL}/person/${id}`, persona);
  }

  deletePersona(id: any): Observable<any> {
    return this.http.delete(`${this.URL}/person/${id}`);
  }
}
