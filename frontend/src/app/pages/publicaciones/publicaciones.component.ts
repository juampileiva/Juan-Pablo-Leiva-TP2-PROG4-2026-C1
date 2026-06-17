import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent {
  publicaciones = [
    {
      titulo: 'Bienvenido a la red social',
      mensaje: 'Esta pantalla queda preparada para listar publicaciones en el Sprint 2.',
      autor: 'Sistema',
      fecha: new Date(),
    },
    {
      titulo: 'Sprint 1',
      mensaje: 'En este sprint se configura Angular, NestJS, MongoDB, registro y login.',
      autor: 'Programación IV',
      fecha: new Date(),
    },
  ];
}
