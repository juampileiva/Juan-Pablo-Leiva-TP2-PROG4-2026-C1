import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iniciales', standalone: true })
export class InicialesPipe implements PipeTransform {
  transform(nombre = '', apellido = ''): string {
    const inicialNombre = nombre.trim().charAt(0) || '';
    const inicialApellido = apellido.trim().charAt(0) || '';
    return `${inicialNombre}${inicialApellido}`.toUpperCase() || 'U';
  }
}
