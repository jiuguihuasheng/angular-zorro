/**
 * 登録系のキャッシュクラス。
 * モジュールレベルのシングルケース。
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { OperationType } from './enum';

@Injectable()
export class CacheInputService {

  // 完了フラグ
  private _complete = false;

  // 編集用データ
  private _cacheData: any;

  // 編集種類（新規／変更／削除）
  private _operationType: OperationType;

  constructor() {

  }

  get cacheData() {
    return this._cacheData;
  }

  set cacheData(defaultData) {
    this._cacheData = defaultData;
  }

  get operationType() {
    return this._operationType;
  }

  set operationType(moduleId: OperationType) {
    this._operationType = moduleId;
  }

  get complete(): boolean {
    return this._complete;
  }

  set complete(value: boolean) {
    this._complete = value;
  }

  clear = () => {
    this._cacheData = null;
  }
}
