import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import {
  ComentarioPublicacion,
  Publicacion,
  PublicacionesService,
} from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './publicacion-detalle.component.html',
  styleUrl: './publicacion-detalle.component.css',
})
export class PublicacionDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);

  usuario: Usuario | null = null;
  publicacion: Publicacion | null = null;
  comentarios: ComentarioPublicacion[] = [];

  publicacionId = '';
  offsetComentarios = 0;
  limitComentarios = 5;
  totalComentarios = 0;

  cargando = false;
  cargandoComentarios = false;
  guardandoComentario = false;
  mensajeError = '';
  mensajeOk = '';
  comentarioEditandoId = '';

  formComentario = this.fb.group({
    mensaje: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
  });

  formEdicion = this.fb.group({
    mensaje: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.publicacionId = this.route.snapshot.paramMap.get('id') || '';

    this.cargarPublicacion();
    this.cargarComentarios(true);
  }

  cargarPublicacion(): void {
    if (!this.usuario || !this.publicacionId) return;

    this.cargando = true;
    this.mensajeError = '';

    this.publicacionesService
      .obtenerPorId(this.publicacionId, this.usuario.id)
      .subscribe({
        next: (res) => {
          this.publicacion = res.publicacion;
          this.cargando = false;
        },
        error: (err) => {
          this.mensajeError = err.error?.message || 'No se pudo cargar la publicación.';
          this.cargando = false;
        },
      });
  }

  cargarComentarios(reiniciar = false): void {
    if (!this.publicacionId) return;

    if (reiniciar) {
      this.offsetComentarios = 0;
      this.comentarios = [];
    }

    this.cargandoComentarios = true;

    this.publicacionesService
      .listarComentarios(this.publicacionId, this.offsetComentarios, this.limitComentarios)
      .subscribe({
        next: (res) => {
          this.comentarios = [...this.comentarios, ...res.comentarios];
          this.totalComentarios = res.total;
          this.offsetComentarios += res.comentarios.length;
          this.cargandoComentarios = false;
        },
        error: (err) => {
          this.mensajeError = err.error?.message || 'No se pudieron cargar los comentarios.';
          this.cargandoComentarios = false;
        },
      });
  }

  agregarComentario(): void {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (this.formComentario.invalid) {
      this.formComentario.markAllAsTouched();
      return;
    }

    this.guardandoComentario = true;

    this.publicacionesService
      .agregarComentario(this.publicacionId, this.formComentario.value.mensaje || '')
      .subscribe({
        next: (res) => {
          this.mensajeOk = 'Comentario publicado.';
          this.guardandoComentario = false;
          this.formComentario.reset();
          this.publicacion = res.publicacion;
          this.cargarComentarios(true);
        },
        error: (err) => {
          this.mensajeError = err.error?.message || 'No se pudo publicar el comentario.';
          this.guardandoComentario = false;
        },
      });
  }

  iniciarEdicion(comentario: ComentarioPublicacion): void {
    this.comentarioEditandoId = comentario.id;
    this.formEdicion.setValue({ mensaje: comentario.mensaje });
  }

  cancelarEdicion(): void {
    this.comentarioEditandoId = '';
    this.formEdicion.reset();
  }

  guardarEdicion(comentario: ComentarioPublicacion): void {
    if (this.formEdicion.invalid) {
      this.formEdicion.markAllAsTouched();
      return;
    }

    this.publicacionesService
      .editarComentario(this.publicacionId, comentario.id, this.formEdicion.value.mensaje || '')
      .subscribe({
        next: (res) => {
          this.comentarios = this.comentarios.map((item) =>
            item.id === comentario.id ? res.comentario : item,
          );
          this.cancelarEdicion();
          this.mensajeOk = 'Comentario editado.';
        },
        error: (err) => {
          this.mensajeError = err.error?.message || 'No se pudo editar el comentario.';
        },
      });
  }

  cambiarLike(): void {
    if (!this.usuario || !this.publicacion) return;

    const peticion = this.publicacion.meGusta
      ? this.publicacionesService.quitarMeGusta(this.publicacion.id, this.usuario.id)
      : this.publicacionesService.darMeGusta(this.publicacion.id, this.usuario.id);

    peticion.subscribe({
      next: (res) => {
        this.publicacion = res.publicacion;
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'No se pudo actualizar el me gusta.';
      },
    });
  }

  get puedeCargarMas(): boolean {
    return this.comentarios.length < this.totalComentarios;
  }
}
