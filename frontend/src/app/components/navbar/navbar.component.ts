import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuAbierto = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  estaLogueado(): boolean {
    return this.authService.obtenerUsuario() !== null;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.menuAbierto = false;
    this.router.navigateByUrl('/login');
  }
}