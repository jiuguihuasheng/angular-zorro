/**
 *  確認画面コンポーネントの親クラス。
 *  @version 1.0
 *  @author
 */
import { Injector } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AbstractBaseComponenet } from './abstract.base.component';
import { ApiOption } from '../interface.class';
import { Observable } from 'rxjs';

export abstract class AbstractConfirmComponent extends AbstractBaseComponenet {

  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * キャンセルボタン処理。
   */
  protected abstract cancel = ($event) => { };

  protected abstract inputBefore = (): ApiOption => { return; };

  /**
   * 完了Modalを表示する。
   */
  protected showCompleteModal = (resp: HttpResponse<any>) => { };

  protected afterViewInit = () => {
    this.errors = null;
    this.initMustData().subscribe((resp) => {
      this.searchMustDataAfter(resp);
    }, (error) => this.handleErrorResponse(error));
  }

  protected initBefore = (): ApiOption => { return; };

  protected init = (apiParams: any): Observable<any> => { return; };

  protected initAfter = () => { };

  protected reset = () => { };

  protected validate = () => {
    return true;
  }

  doInput = ($event) => {
    const eventNode = $event.target ? $event.target.attributes['eventId'] : undefined;

    this.errors = null;
    const apiParam = this.inputBefore();
    this.request(apiParam).subscribe((resp: HttpResponse<any>) => {
      this.showCompleteModal(resp);
    },
      (error: HttpErrorResponse) => this.handleErrorResponse(error));
  }

  /**
   * キャンセルボタン処理。
   */
  doCancel($event) {
    this.cancel($event);
  }
}

