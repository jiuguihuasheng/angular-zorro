/**
 * リスト系のキャッシュクラス、
 * モジュールレベルのシングルケース。
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { PaginateOptions } from './interface.class';

@Injectable()
export class CacheListService {

  private _listPageId: string;

  // 画面初期化のデータ。例えば：ドロップダウンデータ等々。
  private _cacheDataMap: { [key: string]: any } = {};

  // 検索条件。
  private _queryCacheMap: { [key: string]: any } = {};

  // ページネーション。例えば：ページ番号、開始番号、ラスト番号等々。
  private _pageInfoMap: { [key: string]: PaginateOptions } = {};

  constructor() {
  }

  public get listPageId(): string {
    return this._listPageId;
  }

  public set listPageId(value: string) {
    this._listPageId = value;
  }

  /**
   * 画面初期化のデータ。例えば：ドロップダウンデータ等々。
   */
  setCacheData(key: string, data: any) {
    this._cacheDataMap[key] = data;
  }

  getCacheData(key: string) {
    return this._cacheDataMap[key];
  }

  /**
   * 検索条件。
   */
  setQueryCache(key: string, condition: any) {
    this._queryCacheMap[key] = condition;
  }

  getQueryCache(key: string) {
    return this._queryCacheMap[key];
  }

  /**
   * ページネーション。例えば：ページ番号、開始番号、ラスト番号等々。
   */
  setPageInfo(key: string, paginatorOption: PaginateOptions) {
    this._pageInfoMap[key] = paginatorOption;
  }

  getPageInfo(key: string): PaginateOptions {
    return this._pageInfoMap[key];
  }

  /**
   * すべでのデータをクリア。
   */
  clear = (key?: string) => {
    if (key) {
      this._cacheDataMap[key] = null;
      this._queryCacheMap[key] = null;
      this._pageInfoMap[key] = null;
    } else {
      this._cacheDataMap = {};
      this._queryCacheMap = {};
      this._pageInfoMap = {};
    }

  }

}
