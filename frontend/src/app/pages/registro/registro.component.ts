import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  form;
  imagenPerfil: File | null = null;
  cargando = false;
  modalMensaje = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        correo: ['', [Validators.required, Validators.email]],
        nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        repetirPassword: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        descripcionBreve: ['', [Validators.required, Validators.minLength(10)]],
        perfil: ['usuario', [Validators.required]],
      },
      {
        validators: this.passwordsIguales,
      },
    );
  }

  passwordsIguales(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repetirPassword = control.get('repetirPassword')?.value;

    return password === repetirPassword ? null : { passwordsNoCoinciden: true };
  }

  seleccionarImagen(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.imagenPerfil = input.files[0];
    }
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('nombre', this.form.value.nombre ?? '');
    formData.append('apellido', this.form.value.apellido ?? '');
    formData.append('correo', this.form.value.correo ?? '');
    formData.append('nombreUsuario', this.form.value.nombreUsuario ?? '');
    formData.append('password', this.form.value.password ?? '');
    formData.append('repetirPassword', this.form.value.repetirPassword ?? '');
    formData.append('fechaNacimiento', this.form.value.fechaNacimiento ?? '');
    formData.append('descripcionBreve', this.form.value.descripcionBreve ?? '');
    formData.append('perfil', this.form.value.perfil ?? 'usuario');

    if (this.imagenPerfil) {
      formData.append('imagenPerfil', this.imagenPerfil);
    }

    this.cargando = true;

    this.authService.register(formData).subscribe({
      next: (respuesta) => {
        this.authService.guardarUsuario(respuesta.usuario);
        this.router.navigateByUrl('/mi-perfil');
      },
      error: (error) => {
        this.modalMensaje = error.error?.message || 'No se pudo registrar el usuario.';
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }

  cerrarModal(): void {
    this.modalMensaje = '';
  }
}