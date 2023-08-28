import { InterfaceQuestion } from '@/app/core/interfaces/interface-question';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestQuestionService {

  private readonly URL = environment.api + '/api/1.0'

  constructor(
    private http: HttpClient
  ) { }

  createQuestion(question: InterfaceQuestion): Observable<any> {
    return this.http.post(`${this.URL}/testQuestion`, question)
  }

  getAllQuestion(): Observable<any> {
    return this.http.get(`${this.URL}/testQuestion`);
  }
  getQuestion(id: any): Observable<any> {
    return this.http.get(`${this.URL}/testQuestion/${id}`);
  }

  updateQuestion(id: any, question: InterfaceQuestion): Observable<any> {
    return this.http.put(`${this.URL}/testQuestion/${id}`, question);
  }

  deleteQuestion(id: any, body: any): Observable<any> {
    return this.http.delete(`${this.URL}/testQuestion/${id}`,{body});
  }
}
