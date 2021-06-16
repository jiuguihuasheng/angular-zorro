/**
 * 削除画面コンポーネントの親クラス。
 *  @version 1.0
 *  @author
 */
import { Injector } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Modal, MODAL_TYPE } from '../../core-components/modals/modal.component';
import { AbstractBaseComponenet } from './abstract.base.component';
import { ApiOption } from '../interface.class';
import { OperationType } from '../enum';

export abstract class AbstractDeleteComponenet extends AbstractBaseComponenet {

  autoInitWhenLoad = true;

  constructor(injector: Injector) {
    super(injector);
    this.pageOptionType = OperationType.DELETE;
  }

  protected abstract deleteBefore = (): ApiOption => { return; };

  protected abstract deleteAfter = (data: any) => { };

  protected abstract deleteConfrimMsgPrepare = (): any => { };

  protected abstract deleteCompleteMsgPrepare = (): any => { };

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

  doDelete = ($event) => {
    const eventNode = $event.target ? $event.target.attributes['eventId'] : undefined;
    this.showDeleteConfirmModal($event);
  }

  protected showDeleteConfirmModal = ($event) => {
    let title = '';
    let content = '削除しますか?';
    let deleteText = '削除する';
    let cancelText = 'キャンセル';
    let deleteBtnClass = 'c-Btn__delete';
    const info = this.deleteConfrimMsgPrepare();
    if (info) {
      content = info.content ? info.content : content;
      deleteText = info.deleteText ? info.deleteText : deleteText;
      cancelText = info.cancelText ? info.cancelText : cancelText;
      deleteBtnClass = info.deleteBtnClass ? info.deleteBtnClass : deleteBtnClass;
      title = info.title;
    }
    Modal({
      type: MODAL_TYPE.INFO,
      title: title,
      deleteText: deleteText,
      deleteBtnClass: deleteBtnClass,
      cancelText: cancelText,
      content: content,
      ok: () => {
        this.deleteRequest($event);
      },
      cancel: () => true,
    });
  }

  protected deleteRequest = ($event) => {
    this.errors = null;
    const apiParams = this.deleteBefore();
    this.request(apiParams).subscribe(
      (resp) => {
        // TODO, APIのMSG確認後、エラー場合、再修正。
        this.showDeleteCompleteModal(resp);
      },
      (error: HttpErrorResponse) => this.handleErrorResponse(error));
  }


  /**
   * 完了Modalを表示する。
   */
  protected showDeleteCompleteModal = (resp: HttpResponse<any>) => {
    let title = '';
    let content = '削除しました。';
    const info = this.deleteCompleteMsgPrepare();
    if (info) {
      content = info.content ? info.content : content;
      title = info.title;
    }
    Modal({
      type: MODAL_TYPE.INFO,
      title: title,
      content:  content,
      onHidden: () => {
        this.deleteAfter(resp);
      }
    });
  }
}
