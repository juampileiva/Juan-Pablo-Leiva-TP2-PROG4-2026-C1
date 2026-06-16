import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  registro(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/registro`, formData);
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credenciales);
  }
}