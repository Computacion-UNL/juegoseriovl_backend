import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly URL = environment.api + '/api/1.0'

  constructor(
    private http: HttpClient
  ) { }

  createStudent(student: any): Observable<any> {
    return this.http.post(`${this.URL}/student`, student)
  }

  generateCode(CI:any): Observable<any> {
    return this.http.post(`${this.URL}/student/generate`, CI)
  }

  getAllStudent(): Observable<any> {
    return this.http.get(`${this.URL}/student`);
  }
  getStudent(id: any): Observable<any> {
    return this.http.get(`${this.URL}/student/${id}`);
  }

  updateStudent(id: any, student: any): Observable<any> {
    return this.http.put(`${this.URL}/student/${id}`, student);
  }

  deleteStudent(id: any): Observable<any> {
    return this.http.delete(`${this.URL}/student/${id}`);
  }
}
