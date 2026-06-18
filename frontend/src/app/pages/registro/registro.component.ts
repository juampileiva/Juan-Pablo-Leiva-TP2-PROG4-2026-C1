import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordFuerte(control: AbstractControl) {
  const value = control.value || '';
  const tieneOchoCaracteres = value.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(value);
  const tieneNumero = /\d/.test(value);

  return tieneOchoCaracteres && tieneMayuscula && tieneNumero
    ? null
    : { passwordFuerte: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  fotoPerfil: File | null = null;
  vistaPreviaImagen = '';

  mensajeError = '';
  mensajeOk = '';
  cargando = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, passwordFuerte]],
    repetirPassword: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    descripcionBreve: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
    perfil: ['usuario'],
  });

  seleccionarImagen(event: Event) {
    this.mensajeError = '';

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.fotoPerfil = null;
      this.vistaPreviaImagen = '';
      return;
    }

    const archivo = input.files[0];

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!tiposPermitidos.includes(archivo.type)) {
      this.fotoPerfil = null;
      this.vistaPreviaImagen = '';
      this.mensajeError = 'La imagen de perfil debe ser JPG, JPEG, PNG o WEBP.';
      input.value = '';
      return;
    }

    const tamanioMaximo = 2 * 1024 * 1024;

    if (archivo.size > tamanioMaximo) {
      this.fotoPerfil = null;
      this.vistaPreviaImagen = '';
      this.mensajeError = 'La imagen de perfil no puede superar los 2 MB.';
      input.value = '';
      return;
    }

    this.fotoPerfil = archivo;

    const reader = new FileReader();
    reader.onload = () => {
      this.vistaPreviaImagen = reader.result as string;
    };
    reader.readAsDataURL(archivo);
  }

  tieneOchoCaracteres(): boolean {
    return (this.form.value.password || '').length >= 8;
  }

  tieneMayuscula(): boolean {
    return /[A-Z]/.test(this.form.value.password || '');
  }

  tieneNumero(): boolean {
    return /\d/.test(this.form.value.password || '');
  }

  contrasenasCoinciden(): boolean {
    return this.form.value.password === this.form.value.repetirPassword;
  }

  registrar() {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Revisá los campos marcados antes de continuar.';
      return;
    }

    if (!this.contrasenasCoinciden()) {
      this.mensajeError = 'La contraseña y la repetición de contraseña deben coincidir.';
      return;
    }

    const formData = new FormData();

    formData.append('nombre', this.form.value.nombre || '');
    formData.append('apellido', this.form.value.apellido || '');
    formData.append('correo', this.form.value.correo || '');
    formData.append('nombreUsuario', this.form.value.nombreUsuario || '');
    formData.append('password', this.form.value.password || '');
    formData.append('repetirPassword', this.form.value.repetirPassword || '');
    formData.append('fechaNacimiento', this.form.value.fechaNacimiento || '');
    formData.append('descripcionBreve', this.form.value.descripcionBreve || '');
    formData.append('perfil', this.form.value.perfil || 'usuario');

    if (this.fotoPerfil) {
      formData.append('fotoPerfil', this.fotoPerfil);
    }

    this.cargando = true;

    this.authService.registrar(formData).subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.usuario, res.token);
        this.mensajeOk =
          'Usuario registrado correctamente. Redirigiendo...';

        setTimeout(() => {
          this.router.navigateByUrl('/publicaciones');
        }, 900);
      },
      error: (err) => {
        this.mensajeError =
          err.error?.message || 'No se pudo registrar el usuario.';
        this.cargando = false;
      },
    });
  }
}
