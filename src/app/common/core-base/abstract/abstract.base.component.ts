/**
 *  登録系コンポーネントの親クラス。
 *  @version 1.0
 *  @author
 */
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiOption } from '../interface.class';
import { OperationType } from '../enum';
import { Modal, MODAL_TYPE } from '../../core-components/modals/modal.component';

export abstract class AbstractBaseComponenet {

  errors: Array<any>;

  pageOptionType: OperationType;

  // ログインしたユーザーの権限
  loginRole: string;


  constructor(private injector: Injector) {
    this.errors = null;
  }

  /**
   * 登録系画面初期化データ前に、APIパラメータ作成。
   * @returns   APIパラメータ
   */
  protected abstract initBefore = (): ApiOption => { return; };

  /**
   * 登録系画面初期化API返却データ後処理。
   */
  protected abstract initAfter = (resp) => { };

  /**
   * 画面初期化時必要データを取得。
   */
  protected initMustData = ():  Observable<any> => {
    return new Observable(observer => {
      observer.next('');
      observer.complete();
    });
  }

  /**
   * 検索APIデータ戻る後、データ設定。
   * @param data {any}: API返却のデータ
   */
  protected searchMustDataAfter = (data: any) => { };

  /**
   * キャンセルボタン処理。
   */
  protected cancel = ($event) => { };

  /**
   * 確認ボタンが押された時、チェック処理を行う。
   * @returns  チェック結果
   */
  protected abstract validate = (): boolean => true;

  /**
   * リストボタン処理。
   */
  protected goTolist = () => { };


  /**
   * リセットボタン処理。
   * @param defaultData {any} 前回のデータ復元。
   */
  protected reset = (defaultData: any) => { };


  /**
   * editBefore後に、登録API呼び出す。
   */
  protected abstract request = ($event?: ApiOption): Observable<any> => { return; };

  /**
   * エラー処理。
   */
  protected abstract handleError = (error: HttpErrorResponse) => { };

  // protected request = ($event?: ApiOption): Observable<any> => {
  //   return new Observable((observer) => {
  //     console.error('abstract base component  requst shuld be..');
  //     observer.next('');
  //     observer.complete();
  //   });
  // }

  protected confirmBefore = () => { };

  protected confirmAfter = () => { };

  protected handleErrorResponse = (error: HttpErrorResponse) => {
    if (error) {
      this.errors = [error];
    }
    this.handleError(error);
  }

  /**
   * リセットボタン処理。
   */
  // protected doReset = () => {
  //   this.reset(Object.assign({}, this.cacheData));
  // }

  /**
   * キャンセルボタン処理。
   */
  doCancel($event) {
    this.cancel($event);
  }

  toList() {
    this.goTolist();
  }

  /**
   * CSV処理。
   */
  doBatch = () => {
    this.showBatchConfirmModal();
  }

  showBatchConfirmModal = () => {
    let ok = false;
    let content = null;
    if (!content) {
      content = `ファイル作成処理を開始しました。
処理状況画面で結果の確認およびファイルのダウンロードができます。`;
    }
    Modal({
      type: MODAL_TYPE.CONFIRM,
      title: '処理開始',
      okText: '処理状況画面へ遷移',
      cancelText: '閉じる',
      content: content,
      ok: () => {
        ok = true;
        return true;
      },
      cancel: () => true,
      onHidden: () => {
        if (ok) {
          this.toBatchPage();
        }
      }
    });
  }

  toBatchPage = () => {
  }
}


