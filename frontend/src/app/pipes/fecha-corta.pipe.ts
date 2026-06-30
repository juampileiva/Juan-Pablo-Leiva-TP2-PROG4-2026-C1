import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaCorta', standalone: true })
export class FechaCortaPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return '-';
    const fecha = new Date(value);
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
