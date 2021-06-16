/**
 *  ボタン
 *  @version 1.0
 *  @author
 */
import { Component, Input, ElementRef, Renderer2, HostListener, Output, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { DomHandler } from '../dom/domhandler';
import { Role } from '../role.enum';
import * as _ from 'lodash';
import { AuthInfoService } from '../../core-services/auth-info.service';

@Component({
  // tslint:disable-next-line
  selector: 'cpButton',
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.css'
  ],
  providers: [
    DomHandler
  ],
  exportAs: 'cpButton'
})
export class ButtonComponent implements OnInit {

  public validRole = true;

  @Input() disabled: boolean;

  @Input()
  set class(classStr: string) {
    if (classStr) {
      const el = this.elemRef.nativeElement.querySelector('button');
      if (el) {
        this.domHandler.addMultipleClasses(el, classStr);
      }
    }
  }

  @Input() tabindex = -1;

  @Input() ignoreEnter = true;

  @Input() eventId: string;

  // button class
  @Input() btnClass: string;

  /**
   * ボタンの役割
   */
  @Input() authRole: any[];

  @Input() titleName: string;

  @Input() btnIcon: string;

  // left right
  @Input() position: string;

  constructor(private elemRef: ElementRef, private renderer: Renderer2,
    private domHandler: DomHandler,
    private authInfoService: AuthInfoService) {
  }

  @HostListener('click', ['$event'])
  onMouseOver(event) {
    const target = event.target;
    if (target) {
      target.blur();
    }
  }

  ngOnInit(): void {
    this.validRole = this.authInfoService.authsCheck(this.authRole);
  }

}
