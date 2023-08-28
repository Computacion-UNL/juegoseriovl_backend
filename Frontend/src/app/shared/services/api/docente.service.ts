import { ApiResponse } from '@/app/core/interfaces/interface-response';
import { EvaluatorRole } from '@/app/core/interfaces/interface-roleEvaluator';
import { InterfaceTeacher } from '@/app/core/interfaces/interface-teacher';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  private readonly URL = environment.api + '/api/1.0';

  constructor(private http: HttpClient) {}

  createTeacher(teacher: EvaluatorRole): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.URL}/teacher`, teacher);
  }

  getAllTeacher(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/teacher`);
  }


  getTeachersInstitutions(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.URL}/teacher/casos`, data);
  }

  getTeacher(id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/teacher/${id}`);
  }

  updateTeacher(id: string, teacher: EvaluatorRole): Observable<ApiResponse> {
    console.log(teacher)
    return this.http.put<ApiResponse>(`${this.URL}/teacher/${id}`, teacher);
  }

  deleteTeacher(id: any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.URL}/teacher/${id}`);
  }
}
