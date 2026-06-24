import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensajeError = '';
  mensajeOk = '';
  cargando = false;

  form = this.fb.group({
    usuarioOCorreo: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ingresar() {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService
      .login({
        usuarioOCorreo: this.form.value.usuarioOCorreo || '',
        password: this.form.value.password || '',
      })
      .subscribe({
        next: (res) => {
          this.authService.guardarSesion(res.usuario, res.token);
          this.mensajeOk = 'Login correcto. Redirigiendo...';

          setTimeout(() => {
            this.router.navigateByUrl('/publicaciones');
          }, 700);
        },
        error: (err) => {
          this.mensajeError =
            err.error?.message || 'No se pudo iniciar sesión.';
          this.cargando = false;
        },
      });
  }
}
