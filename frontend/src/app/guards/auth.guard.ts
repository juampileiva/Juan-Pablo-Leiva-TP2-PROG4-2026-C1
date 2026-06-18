import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.obtenerUsuario();
  const token = authService.obtenerToken();

  if (usuario && usuario.correo && token) {
    return true;
  }

  authService.cerrarSesion();
  router.navigateByUrl('/login');
  return false;
};
