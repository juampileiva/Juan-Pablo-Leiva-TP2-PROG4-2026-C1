import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { ImagenFallbackDirective } from '../../directives/imagen-fallback.directive';
import { FechaCortaPipe } from '../../pipes/fecha-corta.pipe';
import { InicialesPipe } from '../../pipes/iniciales.pipe';
import { ResumenPipe } from '../../pipes/resumen.pipe';
import { Usuario } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

function passwordsIguales(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const repetirPassword = control.get('repetirPassword')?.value;

  if (!password || !repetirPassword) {
    return null;
  }

  return password === repetirPassword ? null : { passwordsDistintas: true };
}

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
  cantidadVisible = 6;

  cargando = false;
  guardando = false;

  mensajeError = '';
  mensajeOk = '';

  fotoPerfil: File | null = null;

  form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)],
      ],
      repetirPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcionBreve: ['', [Validators.required, Validators.maxLength(250)]],
      perfil: ['usuario', [Validators.required]],
    },
    { validators: passwordsIguales },
  );

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get usuariosMostrados(): Usuario[] {
    return this.usuarios.slice(0, this.cantidadVisible);
  }

  get quedanUsuarios(): boolean {
    return this.cantidadVisible < this.usuarios.length;
  }

  cargarMas(): void {
    this.cantidadVisible += 6;
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
        this.mensajeError =
          err.error?.message || 'No se pudieron cargar los usuarios.';
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

      if (this.form.hasError('passwordsDistintas')) {
        this.mensajeError = 'Las contraseñas no coinciden.';
        return;
      }

      this.mensajeError = 'Revisá los campos marcados antes de crear el usuario.';
      return;
    }

    const data = new FormData();

    Object.entries(this.form.value).forEach(([clave, valor]) => {
      data.append(clave, String(valor || ''));
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
        this.cantidadVisible = 6;
        this.cargarUsuarios();
      },
      error: (err) => {
        const mensajeBackend = err.error?.message;

        this.mensajeError = Array.isArray(mensajeBackend)
          ? mensajeBackend.join(' ')
          : mensajeBackend || 'No se pudo crear el usuario.';

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
      error: (err) =>
        (this.mensajeError =
          err.error?.message || 'No se pudo deshabilitar el usuario.'),
    });
  }

  habilitar(usuario: Usuario): void {
    this.usuariosService.habilitar(usuario.id).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario habilitado.';
        this.cargarUsuarios();
      },
      error: (err) =>
        (this.mensajeError =
          err.error?.message || 'No se pudo habilitar el usuario.'),
    });
  }
}
