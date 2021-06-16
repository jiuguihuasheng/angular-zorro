/**
 *  html body層の追加/廃棄  directive
 *  @version 1.0
 *  @author
 */
import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';


@Directive({
  // tslint:disable-next-line
  selector: '[cpOverLayModal]',
  exportAs: 'overLayModal',
})
export class OverLayModalDirective implements OnInit, OnDestroy {

  @Input()
  component: any;

  @Input()
  visible: any;

  length = 0;

  constructor() {}

  ngOnInit() {
    if (this.visible && this.component) {
      document.body.appendChild(this.component);
      this.length = document.body.children.length;
    }
  }

  ngOnDestroy() {
    // if (document.body.children && this.length === document.body.children.length) {
    //   document.body.removeChild(this.component);
    // }
    if (document.body.contains(this.component) ) {
      document.body.removeChild(this.component);
    }
  }
}
