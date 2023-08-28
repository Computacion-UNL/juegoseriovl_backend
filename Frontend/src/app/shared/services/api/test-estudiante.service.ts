import { InterfaceTestEstudiante } from '@/app/core/interfaces/test-estudiante';
import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestEstudianteService {
  private readonly URL = environment.api + '/api/1.0'

  constructor(
    private http: HttpClient
  ) { }
  
  createPregunta(pregunta: FormData): Observable<any> {
    return this.http.post(`${this.URL}/testImages`, pregunta)
  } 

  getAllPregunta(): Observable<any> {
    return this.http.get(`${this.URL}/testImages`);
  }

  getAllPreguntaPaginated(): Observable<any> {
  
    return this.http.get(`${this.URL}/testImages/paginated`);
  }

  getPregunta(id: any): Observable<any> {
    return this.http.get(`${this.URL}/testImages/${id}`);
  }

  updatePregunta(id: any, pregunta: FormData): Observable<any> {
    return this.http.put(`${this.URL}/testImages/${id}`, pregunta);
  }

  deletePregunta(id: any,body: any): Observable<any> {
    return this.http.delete(`${this.URL}/testImages/${id}`,{body});
  }


}
