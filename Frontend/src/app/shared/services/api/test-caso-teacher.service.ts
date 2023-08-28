import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestCasoTeacherService {
  private readonly URL = environment.api + '/api/1.0';

  constructor(private http: HttpClient) {}

  create(body: any): Observable<any> {
    return this.http.post(`${this.URL}/testTeacher`, body);
  }

  getAll(id:any): Observable<any> {
    return this.http.get(`${this.URL}/testTeacher/teacher/${id}`);
  }
  getTestTeacher(id: any): Observable<any> {
    return this.http.get(`${this.URL}/testTeacher/${id}`);
  }


  update(id: any, body: any): Observable<any> {
    return this.http.put(`${this.URL}/testTeacher/${id}`, body);
  }


  delete(id: any, body:any): Observable<any> {
    return this.http.delete(`${this.URL}/testTeacher/${id}`,{body});
  }
}
