import { Component } from '@angular/core';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
})
export class PublicacionesComponent {
  publicaciones = [
    {
      titulo: 'Bienvenido al TP2',
      mensaje: 'Pantalla Publicaciones creada para Sprint 1. En Sprint 2 se conecta el listado real, likes y paginación.',
      autor: 'Sistema',
    },
    {
      titulo: 'Diseño uniforme',
      mensaje: 'La app ya tiene navegación, estilos compartidos y estructura limpia para seguir creciendo.',
      autor: 'Red Social TP2',
    },
  ];
}
