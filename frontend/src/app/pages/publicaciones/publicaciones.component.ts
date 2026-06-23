import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card.component';
import { AuthService, Usuario } from '../../services/auth.service';
import { Publicacion, PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PublicacionCardComponent],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  private fb = inject(FormBuilder);

  usuario: Usuario | null = null;
  publicaciones: Publicacion[] = [];

  orden: 'fecha' | 'likes' = 'fecha';
  pagina = 0;
  limit = 6;
  total = 0;

  imagen: File | null = null;
  vistaPreviaImagen = '';
  mensajeError = '';
  mensajeOk = '';
  cargando = false;
  guardando = false;
  modalPublicacionAbierto = false;

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, Validators.maxLength(600)]],
  });

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    if (!this.usuario) return;

    this.cargando = true;
    this.mensajeError = '';

    this.publicacionesService
      .listar({
        orden: this.orden,
        offset: this.pagina * this.limit,
        limit: this.limit,
        usuarioActualId: this.usuario.id,
      })
      .subscribe({
        next: (res) => {
          this.publicaciones = res.publicaciones;
          this.total = res.total;
          this.cargando = false;
        },
        error: (err) => {
          this.mensajeError =
            err.error?.message || 'No se pudieron cargar las publicaciones.';
          this.cargando = false;
        },
      });
  }

  abrirModalPublicacion(): void {
    this.mensajeError = '';
    this.mensajeOk = '';
    this.modalPublicacionAbierto = true;
  }

  cerrarModalPublicacion(): void {
    if (this.guardando) return;

    this.modalPublicacionAbierto = false;
    this.form.reset();
    this.imagen = null;
    this.vistaPreviaImagen = '';
    this.mensajeError = '';
  }

  cambiarOrden(orden: 'fecha' | 'likes'): void {
    this.orden = orden;
    this.pagina = 0;
    this.cargarPublicaciones();
  }

  seleccionarImagen(event: Event): void {
    this.mensajeError = '';

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.imagen = null;
      this.vistaPreviaImagen = '';
      return;
    }

    const archivo = input.files[0];
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!tiposPermitidos.includes(archivo.type)) {
      this.imagen = null;
      this.vistaPreviaImagen = '';
      this.mensajeError = 'La imagen debe ser JPG, JPEG, PNG o WEBP.';
      input.value = '';
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      this.imagen = null;
      this.vistaPreviaImagen = '';
      this.mensajeError = 'La imagen no puede superar los 2 MB.';
      input.value = '';
      return;
    }

    this.imagen = archivo;

    const reader = new FileReader();
    reader.onload = () => {
      this.vistaPreviaImagen = reader.result as string;
    };
    reader.readAsDataURL(archivo);
  }

  crearPublicacion(): void {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (!this.usuario) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Revisá el título y la descripción.';
      return;
    }

    const data = new FormData();
    data.append('usuarioId', this.usuario.id);
    data.append('titulo', this.form.value.titulo || '');
    data.append('descripcion', this.form.value.descripcion || '');

    if (this.imagen) {
      data.append('imagen', this.imagen);
    }

    this.guardando = true;

    this.publicacionesService.crear(data).subscribe({
      next: () => {
        this.mensajeOk = 'Publicación creada correctamente.';
        this.guardando = false;
        this.modalPublicacionAbierto = false;
        this.form.reset();
        this.imagen = null;
        this.vistaPreviaImagen = '';
        this.pagina = 0;
        this.cargarPublicaciones();
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'No se pudo crear la publicación.';
        this.guardando = false;
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
        this.actualizarPublicacion(res.publicacion);
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
          this.cargarPublicaciones();
        },
        error: (err) => {
          this.mensajeError =
            err.error?.message || 'No se pudo eliminar la publicación.';
        },
      });
  }

  paginaAnterior(): void {
    if (this.pagina === 0) return;
    this.pagina--;
    this.cargarPublicaciones();
  }

  paginaSiguiente(): void {
    if ((this.pagina + 1) * this.limit >= this.total) return;
    this.pagina++;
    this.cargarPublicaciones();
  }

  get totalPaginas(): number {
    return Math.max(Math.ceil(this.total / this.limit), 1);
  }

  private actualizarPublicacion(publicacionActualizada: Publicacion): void {
    this.publicaciones = this.publicaciones.map((publicacion) =>
      publicacion.id === publicacionActualizada.id ? publicacionActualizada : publicacion,
    );
  }
}
