import { InterfaceCaso } from '@/app/core/interfaces/interface-caso';
import { ApiResponse } from '@/app/core/interfaces/interface-response';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasosService {
  private readonly URL = environment.api + '/api/1.0'

  constructor(
    private http: HttpClient
  ) { }

  createCaso(Caso: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.URL}/caso`, Caso)
  }

  getAllCaso(id:any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/caso/casos/${id}`);
  }

  getAllCasosTeacher(id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/caso/teacher/${id}`);
  }

  createTestTeacher(body: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.URL}/caso/test/teacher`, body)
  }

  getCaso(id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/caso/${id}`);
  }

  getReporte(id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/caso/reporte/${id}`);
  }

  updateCaso(id: any, Caso: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.URL}/caso/${id}`, Caso);
  }

  deleteCaso(id: any, body:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.URL}/caso/${id}`, {body});
  }
}
