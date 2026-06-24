import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cargando',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cargando.component.html',
  styleUrl: './cargando.component.css',
})
export class CargandoComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const token = this.authService.obtenerToken();

    if (!token) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.authService.autorizar().subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.usuario, token);
        this.router.navigateByUrl('/publicaciones');
      },
      error: () => {
        this.authService.cerrarSesion();
        this.router.navigateByUrl('/login');
      },
    });
  }
}
