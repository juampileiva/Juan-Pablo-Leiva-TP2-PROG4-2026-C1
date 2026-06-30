import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatoCantidad, EstadisticasService } from '../../services/estadisticas.service';
import { FechaCortaPipe } from '../../pipes/fecha-corta.pipe';

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, FechaCortaPipe],
  templateUrl: './dashboard-estadisticas.component.html',
  styleUrl: './dashboard-estadisticas.component.css',
})
export class DashboardEstadisticasComponent implements OnInit {
  desde = '';
  hasta = '';

  publicacionesUsuario: DatoCantidad[] = [];
  comentariosLapso: DatoCantidad[] = [];
  comentariosPublicacion: DatoCantidad[] = [];

  cargando = false;
  mensajeError = '';

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    const hoy = new Date();
    const hace30 = new Date();
    hace30.setDate(hoy.getDate() - 30);

    this.desde = hace30.toISOString().slice(0, 10);
    this.hasta = hoy.toISOString().slice(0, 10);
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.estadisticasService.publicacionesPorUsuario(this.desde, this.hasta).subscribe({
      next: (res) => this.publicacionesUsuario = res.datos,
      error: (err) => this.mensajeError = err.error?.message || 'No se pudieron cargar las estadísticas.',
    });

    this.estadisticasService.comentariosPorLapso(this.desde, this.hasta).subscribe({
      next: (res) => this.comentariosLapso = res.datos,
      error: (err) => this.mensajeError = err.error?.message || 'No se pudieron cargar las estadísticas.',
    });

    this.estadisticasService.comentariosPorPublicacion(this.desde, this.hasta).subscribe({
      next: (res) => {
        this.comentariosPublicacion = res.datos;
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'No se pudieron cargar las estadísticas.';
        this.cargando = false;
      },
    });
  }

  maximo(datos: DatoCantidad[]): number {
    return Math.max(...datos.map((item) => item.cantidad), 1);
  }

  anchoBarra(cantidad: number, datos: DatoCantidad[]): number {
    return Math.max((cantidad / this.maximo(datos)) * 100, 6);
  }

  puntosLinea(): string {
    if (this.comentariosLapso.length === 0) return '';
    const max = this.maximo(this.comentariosLapso);
    const paso = this.comentariosLapso.length === 1 ? 280 : 280 / (this.comentariosLapso.length - 1);

    return this.comentariosLapso
      .map((item, index) => {
        const x = 10 + index * paso;
        const y = 120 - (item.cantidad / max) * 90;
        return `${x},${y}`;
      })
      .join(' ');
  }

  porcentajeTorta(item: DatoCantidad): number {
    const total = this.comentariosPublicacion.reduce((acc, actual) => acc + actual.cantidad, 0) || 1;
    return Math.round((item.cantidad / total) * 100);
  }
}
