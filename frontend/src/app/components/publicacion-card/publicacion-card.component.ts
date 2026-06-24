import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Publicacion } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicacion-card.component.html',
  styleUrl: './publicacion-card.component.css',
})
export class PublicacionCardComponent {
  @Input({ required: true }) publicacion!: Publicacion;
  @Input() mostrandoPerfil = false;

  @Output() cambiarLike = new EventEmitter<Publicacion>();
  @Output() eliminar = new EventEmitter<Publicacion>();

  ocultarImagen(event: Event) {
    const imagen = event.target as HTMLImageElement;
    imagen.style.display = 'none';
  }
}
