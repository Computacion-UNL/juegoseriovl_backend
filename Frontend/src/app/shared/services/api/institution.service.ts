import { Observable } from 'rxjs';
import { InterfaceInstitution } from '@/app/core/interfaces/interface-institution';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@/app/core/interfaces/interface-response';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private readonly URL = environment.api + '/api/1.0';

  constructor(private http: HttpClient) {}

  createInstitution(
    institucion: InterfaceInstitution
  ): Observable<ApiResponse> {
    console.log(institucion);
    return this.http.post<ApiResponse>(`${this.URL}/institution`, institucion);
  }

  getAllInstitution(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/institution`);
  }
  getInstitution(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/institution/${id}`);
  }

  updateInstitution(
    id: string,
    institucion: InterfaceInstitution
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.URL}/institution/${id}`,
      institucion
    );
  }

  deleteInstitution(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.URL}/institution/${id}`);
  }
}
