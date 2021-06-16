/**
 *  router directive
 *  @version 1.0
 *  @author
 */
import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NavigationService } from './navigation.service';

@Directive({
  // tslint:disable-next-line
  selector: '[navigation]'
})
export class NavigationDirective {
  @Input()
  route: string;

  @Input()
  params: any;

  @Input()
  isMenuClick = false;

  debug = false;

  @HostListener('click', ['$event'])
  onClick($event) {
    $event.preventDefault();
    if (this.route) {
      if (this.params) {
        this.navigation.navigate(this.route, this.params, this.isMenuClick);
      } else {
        this.navigation.navigate(this.route, false, this.isMenuClick);
      }
    } else {
      if (this.debug) {
        console.warn('navigation directive must pass route or name.');
      }
    }
  }

  constructor(private navigation: NavigationService, private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'pointer';
  }
}
