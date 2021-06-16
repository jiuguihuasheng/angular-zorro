/**
 *  メニューdirective
 *  @version 1.0
 *  @author
 */
import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { DomHandler } from '../../common/core-components/dom/domhandler';
import * as _ from 'lodash';

@Directive({
  // tslint:disable-next-line
  selector: '[cpMenuClick]',
  providers: [DomHandler],
})
export class MenuClickDirective {

  private innerValue: any = '';

  constructor(private el: ElementRef,
    private domHandler: DomHandler) {
  }

  @HostListener('click', ['$event.target'])
  click(event) {
    const node = this.el.nativeElement;
    if (node) {
      const siblings = this.domHandler.siblings(node);
      if (this.domHandler.hasClass(node.lastChild, 'is-active')) {
        this.domHandler.removeClass(node.lastChild, 'is-active');
      } else {
        this.domHandler.addClass(node.lastChild, 'is-active');
        siblings.forEach(sibling => {
          this.domHandler.removeClass(sibling.lastChild, 'is-active');
        });
      }
      const liArray = node.querySelectorAll('li');
      liArray.forEach(li => {
        const liSiblings = this.domHandler.siblings(li);
        const a = li.querySelector('a');
        li.addEventListener('click', () => {
          this.domHandler.addClass(a, 'is-active');
          liSiblings.forEach(liSibling => {
            const aSibling = liSibling.querySelector('a');
            this.domHandler.removeClass(aSibling, 'is-active');
          });
          this.domHandler.addClass(node, 'is-active');
          siblings.forEach(sibling => {
            this.domHandler.removeClass(sibling, 'is-active');
            if (sibling.querySelector('a.is-active')) {
              this.domHandler.removeClass(sibling.querySelector('a.is-active'), 'is-active');
            }
          });
        });
      });
      node.parentNode.querySelector('div.l-Navi__item-logout').addEventListener('click', () => {
        this.domHandler.removeClass(node.lastChild, 'is-active');
      });
    }

  }

}
