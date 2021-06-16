import { Directive, TemplateRef } from '@angular/core';

import { TabDirective } from './tab.directive';

/** Should be used to mark <ng-template> element as a template for tab heading */
// tslint:disable-next-line:directive-selector
@Directive({ selector: '[tabHeading]' })
export class TabHeadingDirective {
  /* tslint:disable-next-line:no-any */
  templateRef: TemplateRef<any>;

  /* tslint:disable-next-line:no-any */
  constructor(templateRef: TemplateRef<any>, tab: TabDirective) {
    tab.headingRef = templateRef;
  }
}
