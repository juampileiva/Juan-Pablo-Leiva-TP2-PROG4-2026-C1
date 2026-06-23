import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComentarioPublicacion {
  nombreUsuario: string;
  mensaje: string;
  fecha: string;
}

export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  usuarioId: string;
  autorNombre: string;
  autorUsuario: string;
  autorFotoUrl: string;
  cantidadLikes: number;
  cantidadComentarios: number;
  comentarios: ComentarioPublicacion[];
  meGusta: boolean;
  esMia: boolean;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RespuestaListadoPublicaciones {
  publicaciones: Publicacion[];
  total: number;
  offset: number;
  limit: number;
  orden: 'fecha' | 'likes';
}

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://juan-pablo-leiva-tp2-prog4-2026-c1-1.onrender.com';

  constructor(private http: HttpClient) {}

  listar(opciones: {
    orden?: 'fecha' | 'likes';
    offset?: number;
    limit?: number;
    usuarioId?: string;
    usuarioActualId?: string;
  }): Observable<RespuestaListadoPublicaciones> {
    let params = new HttpParams();

    if (opciones.orden) params = params.set('orden', opciones.orden);
    if (opciones.offset !== undefined) params = params.set('offset', opciones.offset);
    if (opciones.limit !== undefined) params = params.set('limit', opciones.limit);
    if (opciones.usuarioId) params = params.set('usuarioId', opciones.usuarioId);
    if (opciones.usuarioActualId) params = params.set('usuarioActualId', opciones.usuarioActualId);

    return this.http.get<RespuestaListadoPublicaciones>(`${this.apiUrl}/publicaciones`, { params });
  }

  crear(data: FormData): Observable<{ mensaje: string; publicacion: Publicacion }> {
    return this.http.post<{ mensaje: string; publicacion: Publicacion }>(
      `${this.apiUrl}/publicaciones`,
      data,
    );
  }

  eliminar(publicacionId: string, usuarioId: string, perfil: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/publicaciones/${publicacionId}`,
      { body: { usuarioId, perfil } },
    );
  }

  darMeGusta(publicacionId: string, usuarioId: string): Observable<{ mensaje: string; publicacion: Publicacion }> {
    return this.http.post<{ mensaje: string; publicacion: Publicacion }>(
      `${this.apiUrl}/publicaciones/${publicacionId}/me-gusta`,
      { usuarioId },
    );
  }

  quitarMeGusta(publicacionId: string, usuarioId: string): Observable<{ mensaje: string; publicacion: Publicacion }> {
    return this.http.delete<{ mensaje: string; publicacion: Publicacion }>(
      `${this.apiUrl}/publicaciones/${publicacionId}/me-gusta`,
      { body: { usuarioId } },
    );
  }
}
