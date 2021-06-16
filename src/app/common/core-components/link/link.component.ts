/**
 *  リンク
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, Input, ContentChild, ElementRef, HostListener } from '@angular/core';
import { AuthInfoService } from '../../core-services/auth-info.service';
import { DomHandler } from '../dom/domhandler';

@Component({
  // tslint:disable-next-line
  selector: 'cp-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  providers: [DomHandler],
  exportAs: 'cpLink'
})
export class LinkComponent implements OnInit {

  _el: any;

  // 'a', 'span'
  @Input()
  type = 'span';

  // '/xxx/xxx'
  @Input()
  route: string;

  //  {debug: true}
  @Input()
  params?: any;

  @Input()
  childClass?: any;

  @Input()
  style?: any;

  @Input()
  label = 'XXXXXXXXXXXXX';

  @Input()
  changeByMouseOver = false;

  @Input()
  isMenuClick = false;

  /**
   * ログインユーザーの役割
   */
  @Input() authRole: any[];

  @ContentChild('linkTemplate') linkTemplate: any;

  public validRole = true;

  constructor(private authInfoService: AuthInfoService,
    private domHandler: DomHandler,
    private el: ElementRef) {
      this._el = el;
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    if (this.changeByMouseOver) {
      const target = event.target;
      if (target) {
        target.style.fontSize = '16px';
      }
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    if (this.changeByMouseOver) {
      const target = event.target;
      if (target && target.localName === 'cp-link') {
        const childEl = target.firstElementChild;
        if (childEl) {
          childEl.style.fontSize = 'inherit';
        }
      }
    }
  }

  ngOnInit(): void {
    this.validRole = this.authInfoService.authsCheck(this.authRole);
  }

}
