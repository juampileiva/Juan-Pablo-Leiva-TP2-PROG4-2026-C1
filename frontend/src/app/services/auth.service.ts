import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  fotoPerfilUrl: string;
  perfil: 'usuario' | 'administrador';
  activo: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com';

  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, data);
  }

  login(data: { usuarioOCorreo: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
  }
}
