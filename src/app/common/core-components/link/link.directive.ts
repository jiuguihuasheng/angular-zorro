/**
 *  link 指令
 *  @version 1.0
 *  @author
 */
import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[cpLink]'
})
export class LinkDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) {
    // this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
  }

  // @HostListener('keydown', ['$event'])
  // public disableEnter($event) {
  //   if ($event && $event.keyCode === 13) {
  //     if ($event.preventDefault) {
  //       $event.preventDefault();
  //     } else {
  //       window.event.returnValue = false;
  //     }
  //     return false;
  //   }
  // }
}
