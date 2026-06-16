import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink],
  templateUrl: './mi-perfil.component.html',
})
export class MiPerfilComponent {
  constructor(public readonly authService: AuthService) {}
}
