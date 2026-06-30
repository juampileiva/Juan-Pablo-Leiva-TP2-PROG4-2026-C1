import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[appResaltarPropio]', standalone: true })
export class ResaltarPropioDirective {
  @Input() appResaltarPropio = false;

  @HostBinding('class.elemento-propio') get propio(): boolean {
    return this.appResaltarPropio;
  }
}
