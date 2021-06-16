import {
  NgModule, EventEmitter, Directive, ViewContainerRef,
  Input, Output, ContentChildren, ContentChild, TemplateRef,
  OnInit, OnChanges, OnDestroy, AfterContentInit, QueryList,
  SimpleChanges, EmbeddedViewRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line
  selector: 'cp-header',
  template: '<ng-content></ng-content>'
})
export class HeaderComponent { }

@Component({
  // tslint:disable-next-line
  selector: 'cp-footer',
  template: '<ng-content></ng-content>'
})
export class FooterComponent { }

@Directive({
  // tslint:disable-next-line
  selector: '[cpTemplate]',
})
export class CPTemplateDirective {

  @Input() type: string;

  @Input('cpTemplate') name: string;

  constructor(public template: TemplateRef<any>) { }

  getType(): string {
    return this.name;
  }
}

