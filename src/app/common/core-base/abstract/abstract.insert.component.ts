/**
 * 登録画面コンポーネントの親クラス。
 *  @version 1.0
 *  @author
 */
import { Injector } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Modal, MODAL_TYPE } from '../../core-components/modals/modal.component';
import { AbstractBaseComponenet } from './abstract.base.component';
import { Observable } from 'rxjs';
import { ApiOption } from '../interface.class';
import { OperationType } from '../enum';

export abstract class AbstractInsertComponenet extends AbstractBaseComponenet {


  constructor(injector: Injector) {
    super(injector);
    this.pageOptionType = OperationType.INSERT;
  }

  /**
   * 登録API呼び出す前に，APIパラメータを整理。
   * @returns  APIパラメータ
   */
  protected abstract insertBefore = (): ApiOption => { return; };

    /**
   * 登録API返却データを処理。
   * @param data {any} API返却データ
   */
  protected abstract insertAfter = (data: any) => { };

  protected abstract insertCompleteMsgPrepare = (data?: any): any => { };
  /**
   * 再入力時、画面初期化
   */
  protected reInsertInit = () => { };

  protected initBefore = (): ApiOption => { return; };

  protected init = (apiParams: any): Observable<any> => { return; };

  protected initAfter = () => { };

  /**
  * 画面読み込め後、画面データ設定。
  * @param data {any} 画面データ、例えば：ドロップダウンデータ…
  */
  protected afterViewInit = (data: any) => {
    this.initMustData().subscribe((resp) => {
      this.searchMustDataAfter(resp);
    }, (error) => this.handleErrorResponse(error));
  }

  /**
   * 入力ボタン処理。
   */
  doInsert = ($event) => {
    const eventNode = $event.target ? $event.target.attributes['eventId'] : undefined;
    if (!this.validate()) {
      return;
    }
    this.errors = null;
    const apiParam =  this.insertBefore();
    this.request(apiParam).subscribe((resp: HttpResponse<any>) => {
      this.showCompleteModal(resp);
    },
    (error: HttpErrorResponse) =>  this.handleErrorResponse(error));
  }

  doConfirm = ($event) => {
    if (!this.validate()) {
      return;
    }
    const data = this.confirmBefore();
    this.confirmAfter();
  }


  /**
   * 完了Modalを表示する。
   */
  protected showCompleteModal = (resp: HttpResponse<any>) => {
    let content = '登録完了しました。';
    let textAlign = 'left';
    const info = this.insertCompleteMsgPrepare(resp);
    if (info) {
      content = info.content ? info.content : content;
      textAlign = info.textAlign ? info.textAlign : textAlign;
    }
    Modal({
      type: MODAL_TYPE.INFO,
      content: content,
      textAlign: textAlign,
      onHidden: () => {
        this.insertAfter(resp);
      }
      // ok: () => {
      //   this.insertAfter(resp);
      //   return true;
      // },
      // reInputText: '再入力',
      // reInput: () => {
      //   this.reInsertInit();
      //   return true;
      // }
    });
  }

}
