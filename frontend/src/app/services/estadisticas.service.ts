import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DatoCantidad {
  nombre?: string;
  titulo?: string;
  fecha?: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com';

  constructor(private http: HttpClient) {}

  publicacionesPorUsuario(desde: string, hasta: string): Observable<{ datos: DatoCantidad[] }> {
    return this.http.get<{ datos: DatoCantidad[] }>(`${this.apiUrl}/publicaciones/estadisticas/publicaciones-por-usuario`, {
      params: this.paramsFechas(desde, hasta),
    });
  }

  comentariosPorLapso(desde: string, hasta: string): Observable<{ datos: DatoCantidad[] }> {
    return this.http.get<{ datos: DatoCantidad[] }>(`${this.apiUrl}/publicaciones/estadisticas/comentarios-por-lapso`, {
      params: this.paramsFechas(desde, hasta),
    });
  }

  comentariosPorPublicacion(desde: string, hasta: string): Observable<{ datos: DatoCantidad[] }> {
    return this.http.get<{ datos: DatoCantidad[] }>(`${this.apiUrl}/publicaciones/estadisticas/comentarios-por-publicacion`, {
      params: this.paramsFechas(desde, hasta),
    });
  }

  private paramsFechas(desde: string, hasta: string): HttpParams {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return params;
  }
}
