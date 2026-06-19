import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'resumen', standalone: true })
export class ResumenPipe implements PipeTransform {
  transform(texto = '', limite = 120): string {
    if (texto.length <= limite) return texto;
    return texto.slice(0, limite).trim() + '...';
  }
}
