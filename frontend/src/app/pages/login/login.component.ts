import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form;
  cargando = false;
  modalMensaje = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      identificador: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
    });
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const identificador = this.form.value.identificador ?? '';
    const password = this.form.value.password ?? '';

    this.cargando = true;

    this.authService.login(identificador, password).subscribe({
      next: (respuesta) => {
        this.authService.guardarUsuario(respuesta.usuario);
        this.router.navigateByUrl('/mi-perfil');
      },
      error: (error) => {
        this.modalMensaje = error.error?.message || 'No se pudo iniciar sesión.';
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