import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  @ViewChild('miModal') miModal!: ElementRef<HTMLDialogElement>;
  
  modalTitulo: string = '';
  modalMensaje: string = '';
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  registroForm: FormGroup;
  imagen: File | null = null;

  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      repetirContrasena: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcionBreve: ['']
    });
  }

  // Método para mostrar el modal en lugar de alert()
  abrirModal(titulo: string, mensaje: string) {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.miModal.nativeElement.showModal();
  }

  cerrarModal() {
    this.miModal.nativeElement.close();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) this.imagen = event.target.files[0];
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.abrirModal('Error', 'Por favor, completá todos los campos correctamente.');
      return;
    }

    const formData = new FormData();
    Object.keys(this.registroForm.value).forEach(key => {
      if (key !== 'repetirContrasena') formData.append(key, this.registroForm.value[key]);
    });
    if (this.imagen) formData.append('imagenPerfil', this.imagen);

    this.authService.registro(formData).subscribe({
      next: () => this.abrirModal('Éxito', 'Usuario registrado correctamente.'),
      error: () => this.abrirModal('Error', 'Hubo un problema al registrar el usuario.')
    });
  }
}