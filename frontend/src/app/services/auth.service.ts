import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  perfil: 'usuario' | 'administrador';
  imagenPerfilUrl?: string | null;
  activo?: boolean;
}

export interface AuthResponse {
  message: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';

  usuarioActual = signal<Usuario | null>(this.obtenerUsuario());

  constructor(private readonly http: HttpClient) {}

  register(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, formData).pipe(
      tap((respuesta) => {
        this.guardarUsuario(respuesta.usuario);
      }),
    );
  }

  login(identificador: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        identificador,
        password,
      })
      .pipe(
        tap((respuesta) => {
          this.guardarUsuario(respuesta.usuario);
        }),
      );
  }

  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioActual.set(usuario);
  }

  obtenerUsuario(): Usuario | null {
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.usuarioActual.set(null);
  }

  logout(): void {
    this.cerrarSesion();
  }

  getImagenPerfilUrl(usuario: Usuario): string {
    if (usuario.imagenPerfilUrl) {
      if (usuario.imagenPerfilUrl.startsWith('http')) {
        return usuario.imagenPerfilUrl;
      }

      return `http://localhost:3000${usuario.imagenPerfilUrl}`;
    }

    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${usuario.nombre} ${usuario.apellido}`);
  }
}