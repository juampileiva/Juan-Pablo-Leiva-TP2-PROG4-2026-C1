import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[appAutoFocus]', standalone: true })
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.elementRef.nativeElement.focus(), 100);
  }
}
