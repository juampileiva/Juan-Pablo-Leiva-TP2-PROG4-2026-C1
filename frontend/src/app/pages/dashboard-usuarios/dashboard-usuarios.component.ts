import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { FechaCortaPipe } from '../../pipes/fecha-corta.pipe';
import { InicialesPipe } from '../../pipes/iniciales.pipe';
import { ResumenPipe } from '../../pipes/resumen.pipe';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { ImagenFallbackDirective } from '../../directives/imagen-fallback.directive';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FechaCortaPipe,
    InicialesPipe,
    ResumenPipe,
    AutoFocusDirective,
    ImagenFallbackDirective,
  ],
  templateUrl: './dashboard-usuarios.component.html',
  styleUrl: './dashboard-usuarios.component.css',
})
export class DashboardUsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);

  usuarios: Usuario[] = [];
  cargando = false;
  guardando = false;
  mensajeError = '';
  mensajeOk = '';
  fotoPerfil: File | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    repetirPassword: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    descripcionBreve: ['', [Validators.required, Validators.maxLength(250)]],
    perfil: ['usuario', [Validators.required]],
  });

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.usuariosService.listar().subscribe({
      next: (res) => {
        this.usuarios = res.usuarios;
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'No se pudieron cargar los usuarios.';
        this.cargando = false;
      },
    });
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fotoPerfil = input.files?.[0] || null;
  }

  crearUsuario(): void {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Revisá los datos del usuario.';
      return;
    }

    if (this.form.value.password !== this.form.value.repetirPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const data = new FormData();
    Object.entries(this.form.value).forEach(([clave, valor]) => {
      if (clave !== 'repetirPassword') {
        data.append(clave, String(valor || ''));
      }
    });

    if (this.fotoPerfil) {
      data.append('fotoPerfil', this.fotoPerfil);
    }

    this.guardando = true;

    this.usuariosService.crear(data).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario creado correctamente.';
        this.guardando = false;
        this.form.reset({ perfil: 'usuario' });
        this.fotoPerfil = null;
        this.cargarUsuarios();
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'No se pudo crear el usuario.';
        this.guardando = false;
      },
    });
  }

  deshabilitar(usuario: Usuario): void {
    this.usuariosService.deshabilitar(usuario.id).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario deshabilitado.';
        this.cargarUsuarios();
      },
      error: (err) => this.mensajeError = err.error?.message || 'No se pudo deshabilitar el usuario.',
    });
  }

  habilitar(usuario: Usuario): void {
    this.usuariosService.habilitar(usuario.id).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario habilitado.';
        this.cargarUsuarios();
      },
      error: (err) => this.mensajeError = err.error?.message || 'No se pudo habilitar el usuario.',
    });
  }
}
