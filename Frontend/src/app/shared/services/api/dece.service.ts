import { ApiResponse } from '@/app/core/interfaces/interface-response';
import { InterfaceDece } from './../../../core/interfaces/interface-dece';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeceService {
  private readonly URL = environment.api + '/api/1.0';

  constructor(private http: HttpClient) {}

  createDece(dece: InterfaceDece): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.URL}/dece`, dece);
  }

  getAllDece(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/dece`);
  }
  getDece(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/dece/${id}`);
  }

  updateDece(id: string, dece: InterfaceDece): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.URL}/dece/${id}`, dece);
  }

  deleteDece(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.URL}/dece/${id}`);
  }
}
