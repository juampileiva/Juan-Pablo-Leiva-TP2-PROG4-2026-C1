import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

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
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com';

  private timerSesion: any = null;
  private avisoSesionSubject = new BehaviorSubject(false);
  avisoSesion$ = this.avisoSesionSubject.asObservable();

  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, data);
  }

  login(data: { usuarioOCorreo: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  autorizar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/autorizar`, {});
  }

  refrescarToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/refrescar`, {});
  }

  guardarSesion(usuario: Usuario, token: string): void {
    this.guardarUsuario(usuario);
    this.guardarToken(token);
    this.iniciarControlSesion();
  }

  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string {
    return localStorage.getItem('token') || '';
  }

  iniciarControlSesion(): void {
    clearTimeout(this.timerSesion);
    this.avisoSesionSubject.next(false);

    const token = this.obtenerToken();
    const exp = this.obtenerExpiracionToken(token);

    if (!exp) return;

    const ahora = Math.floor(Date.now() / 1000);
    const segundosHastaAviso = exp - ahora - 5 * 60;

    this.timerSesion = setTimeout(
      () => this.avisoSesionSubject.next(true),
      Math.max(segundosHastaAviso, 0) * 1000,
    );
  }

  ocultarAvisoSesion(): void {
    this.avisoSesionSubject.next(false);
  }

  cerrarSesion(): void {
    clearTimeout(this.timerSesion);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.avisoSesionSubject.next(false);
  }

  private obtenerExpiracionToken(token: string): number | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.exp || null;
    } catch {
      return null;
    }
  }
}
