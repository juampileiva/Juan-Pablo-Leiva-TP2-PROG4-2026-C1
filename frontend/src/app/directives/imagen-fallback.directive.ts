import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: 'img[appImagenFallback]', standalone: true })
export class ImagenFallbackDirective {
  @Input() appImagenFallback = 'assets/foto-perfil-default.png';

  constructor(private elementRef: ElementRef<HTMLImageElement>) {}

  @HostListener('error') onError(): void {
    this.elementRef.nativeElement.src = this.appImagenFallback;
  }
}
