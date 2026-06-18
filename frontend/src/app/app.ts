import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  mostrarAvisoSesion = false;
  renovandoSesion = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.avisoSesion$.subscribe((mostrar) => {
      this.mostrarAvisoSesion = mostrar;
    });

    if (this.authService.obtenerToken()) {
      this.authService.iniciarControlSesion();
    }
  }

  extenderSesion(): void {
    this.renovandoSesion = true;

    this.authService.refrescarToken().subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.usuario, res.token);
        this.renovandoSesion = false;
      },
      error: () => {
        this.renovandoSesion = false;
        this.authService.cerrarSesion();
        this.router.navigateByUrl('/login');
      },
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}
