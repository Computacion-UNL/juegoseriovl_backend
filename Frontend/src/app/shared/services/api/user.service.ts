import { ApiResponse } from '@/app/core/interfaces/interface-response';
import { UserRole } from '@/app/core/interfaces/interface-roleAdmin';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = environment.api + '/api/1.0';

  constructor(private http: HttpClient) {}

  createUser(user: UserRole): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.URL}/user`, user);
  }

  updateUser(id: any, user: any): Observable<any> {
    return this.http.put(`${this.URL}/user/${id}`, user);
  }

 changePasswordUser(id: any): Observable<any> {
    return this.http.post(`${this.URL}/user/pass`,id);
  }
  getAllUser(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/user`);
  }
  getUser(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.URL}/user/${id}`);
  }

  changedStatusUser(id: string, action: boolean): Observable<ApiResponse> {
    const body = {
      id,
      action,
    };
    return this.http.post<ApiResponse>(`${this.URL}/user/status`, body);
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.URL}/user/${id}`);
  }
}
