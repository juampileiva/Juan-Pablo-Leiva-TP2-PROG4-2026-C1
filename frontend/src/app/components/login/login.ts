import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  enviando = false;
  
  // Variables para controlar el modal de error
  mostrarModalError = false;
  mensajeError = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      identificador: ['', [Validators.required]],
      contrasena: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.enviando = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.enviando = false;
        // Al tener éxito, redirige a la pantalla de publicaciones
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.enviando = false;
        this.mensajeError = err.error?.message || 'Error al intentar iniciar sesión. Verificá tus credenciales.';
        this.mostrarModalError = true;
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModalError = false;
  }
}