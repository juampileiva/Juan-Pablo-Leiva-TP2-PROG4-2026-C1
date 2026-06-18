import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Publicacion } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publicacion-card.component.html',
  styleUrl: './publicacion-card.component.css',
})
export class PublicacionCardComponent {
  @Input({ required: true }) publicacion!: Publicacion;
  @Input() mostrandoPerfil = false;
  @Output() cambiarLike = new EventEmitter<Publicacion>();
  @Output() eliminar = new EventEmitter<Publicacion>();
}
