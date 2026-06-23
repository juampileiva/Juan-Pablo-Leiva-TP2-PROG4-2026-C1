import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card.component';
import { AuthService, Usuario } from '../../services/auth.service';
import { Publicacion, PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicacionCardComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  publicaciones: Publicacion[] = [];
  cargandoPublicaciones = false;
  mensajeError = '';
  mensajeOk = '';

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones(): void {
    if (!this.usuario) return;

    this.cargandoPublicaciones = true;
    this.mensajeError = '';

    this.publicacionesService
      .listar({
        orden: 'fecha',
        offset: 0,
        limit: 3,
        usuarioId: this.usuario.id,
        usuarioActualId: this.usuario.id,
      })
      .subscribe({
        next: (res) => {
          this.publicaciones = res.publicaciones;
          this.cargandoPublicaciones = false;
        },
        error: (err) => {
          this.mensajeError =
            err.error?.message || 'No se pudieron cargar tus publicaciones.';
          this.cargandoPublicaciones = false;
        },
      });
  }

  cambiarLike(publicacion: Publicacion): void {
    if (!this.usuario) return;

    const peticion = publicacion.meGusta
      ? this.publicacionesService.quitarMeGusta(publicacion.id, this.usuario.id)
      : this.publicacionesService.darMeGusta(publicacion.id, this.usuario.id);

    peticion.subscribe({
      next: (res) => {
        this.publicaciones = this.publicaciones.map((item) =>
          item.id === res.publicacion.id ? res.publicacion : item,
        );
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'No se pudo actualizar el me gusta.';
      },
    });
  }

  eliminar(publicacion: Publicacion): void {
    if (!this.usuario) return;

    this.publicacionesService
      .eliminar(publicacion.id, this.usuario.id, this.usuario.perfil)
      .subscribe({
        next: () => {
          this.mensajeOk = 'Publicación eliminada correctamente.';
          this.cargarMisPublicaciones();
        },
        error: (err) => {
          this.mensajeError =
            err.error?.message || 'No se pudo eliminar la publicación.';
        },
      });
  }
}
