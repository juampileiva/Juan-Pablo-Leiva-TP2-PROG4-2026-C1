import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  registroForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  enviando = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
      contrasena: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      repetirContrasena: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcionBreve: ['', [Validators.maxLength(250)]]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('contrasena');
    const repeatPassword = control.get('repetirContrasena');

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    
    if (file) {
      this.imagenSeleccionada = file;
      
      const reader = new FileReader();
      reader.onload = e => this.imagenPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    
    const formData = new FormData();
    Object.keys(this.registroForm.value).forEach(key => {
      if (key !== 'repetirContrasena' && this.registroForm.value[key] !== null) {
        formData.append(key, this.registroForm.value[key]);
      }
    });

    if (this.imagenSeleccionada) {
      formData.append('imagenPerfil', this.imagenSeleccionada);
    }

    this.authService.registro(formData).subscribe({
      next: (response) => {
        this.enviando = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.enviando = false;
        console.error('Error al registrar:', err);
      }
    });
  }
}