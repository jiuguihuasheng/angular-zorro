/**
 * 編集画面コンポーネントの親クラス。
 *  @version 1.0
 *  @author
 */
import { Injector } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Modal, MODAL_TYPE } from '../../core-components/modals/modal.component';
import { AbstractBaseComponenet } from './abstract.base.component';
import { ApiOption } from '../interface.class';
import { OperationType } from '../enum';

export abstract class AbstractEditComponenet extends AbstractBaseComponenet {

  autoInitWhenLoad = true;

  constructor(injector: Injector) {
    super(injector);
    this.pageOptionType = OperationType.EDIT;
  }

  protected abstract editBefore = (): ApiOption => { return; };

  protected abstract editAfter = (data: any) => { };

  protected abstract editCompleteMsgPrepare = (): any => { };

  /**
  * 画面読み込め後、画面データ設定。
  * @param data {any} 画面データ、例えば：ドロップダウンデータ…
  */
  protected afterViewInit = () => {
    this.initMustData().subscribe((resp) => {
      this.searchMustDataAfter(resp);
      if (this.autoInitWhenLoad) {
        this.doInit();
      }
    }, (error) => this.handleErrorResponse(error));
  }

  protected doInit = () => {
    const apiParams  = this.initBefore();
    this.request(apiParams).subscribe((resp) => this.initAfter(resp),
      (error) => this.handleErrorResponse(error)
    );
  }


  doEdit = ($event) => {
    this.errors = null;
    const eventNode = $event.target ? $event.target.attributes['eventId'] : undefined;
    if (!this.validate()) {
      return;
    }
    this.errors = null;
    const apiParams = this.editBefore();
    this.request(apiParams).subscribe(
      (resp) => {
        // TODO, APIのMSG確認後、エラー場合、再修正。
        this.showEditCompleteModal(resp);
      },
      (error: HttpErrorResponse) => this.handleErrorResponse(error));
  }

  /**
   * 完了Modalを表示する。
   */
  protected showEditCompleteModal = (resp: HttpResponse<any>) => {
    let content = '更新が完了しました。';
    const info = this.editCompleteMsgPrepare();
    if (info) {
      content = info.content ? info.content : content;
    }
    Modal({
      type: MODAL_TYPE.INFO,
      content: content,
      onHidden: () => {
        this.editAfter(resp);
      }
    });
  }

  doConfirm = ($event) => {
    if (!this.validate()) {
      return;
    }
    const data = this.confirmBefore();
    this.confirmAfter();
  }
}
