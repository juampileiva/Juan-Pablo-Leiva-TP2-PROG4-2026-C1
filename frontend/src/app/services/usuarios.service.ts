import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com';

  constructor(private http: HttpClient) {}

  listar(): Observable<{ usuarios: Usuario[] }> {
    return this.http.get<{ usuarios: Usuario[] }>(`${this.apiUrl}/usuarios`);
  }

  crear(data: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, data);
  }

  deshabilitar(id: string): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.delete<{ mensaje: string; usuario: Usuario }>(`${this.apiUrl}/usuarios/${id}`);
  }

  habilitar(id: string): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.post<{ mensaje: string; usuario: Usuario }>(`${this.apiUrl}/usuarios/${id}/habilitar`, {});
  }
}
