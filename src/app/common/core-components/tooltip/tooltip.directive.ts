/**
 *  提示ツール
 *  @version 1.0
 *  @author
 */
import { Directive, ElementRef, OnInit, AfterViewInit,
  NgZone } from '@angular/core';
  import { DomHandler } from '../dom/domhandler';

@Directive({
  selector: '[cpTooltip]',
  providers: [DomHandler]
})
export class TooltipDirective implements OnInit, AfterViewInit {

  mouseLeaveListener: Function;

  mouseoverListener: Function;

  constructor(
    public zone: NgZone,
    private domHandler: DomHandler,
    private el: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.mouseoverListener = this.onHover.bind(this);
      this.el.nativeElement.addEventListener('mouseover', this.mouseoverListener);
      this.mouseLeaveListener = this.onLeave.bind(this);
      this.el.nativeElement.addEventListener('mouseout', this.mouseLeaveListener);
    });
  }

  onHover(e: Event) {
    if (this.el.nativeElement) {
      const node = this.el.nativeElement.querySelector('.c-Tooltip__tip');
      if (node) {
        node.style.display = 'block';
        node.style.top = '-30px';
        this.domHandler.fadeIn(node, 250);
      }
    }
  }

  onLeave(e: Event) {
    if (this.el.nativeElement) {
      const node = this.el.nativeElement.querySelector('.c-Tooltip__tip');
      if (node) {
        node.style.display = 'none';
        this.domHandler.fadeIn(node, 250);
      }
    }
  }
}
