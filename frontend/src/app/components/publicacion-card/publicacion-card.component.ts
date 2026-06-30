import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Publicacion } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicacion-card.component.html',
  styleUrl: './publicacion-card.component.css',
})
export class PublicacionCardComponent {
  private router = inject(Router);

  @Input({ required: true }) publicacion!: Publicacion;
  @Input() mostrandoPerfil = false;
  @Input() puedeEliminar = false;

  @Output() cambiarLike = new EventEmitter<Publicacion>();
  @Output() eliminar = new EventEmitter<Publicacion>();

  ocultarImagen(event: Event) {
    const imagen = event.target as HTMLImageElement;
    imagen.style.display = 'none';
  }

  verDetalle() {
    const id = (this.publicacion as any)._id || (this.publicacion as any).id;

    if (id) {
      this.router.navigate(['/publicaciones', id]);
    }
  }
}
