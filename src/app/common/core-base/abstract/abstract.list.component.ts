/**
 * リストページコンポーネントの親クラス。
 *  @version 1.0
 *  @author
 */
import { Injector } from '@angular/core';
import { CacheListService } from '../cache.list.service';
import { AbstractBaseComponenet } from './abstract.base.component';
import { ApiOption, PaginateOptions } from '../interface.class';
import * as _ from 'lodash';
import { Globals } from '../../global';

export abstract class AbstractListComponent extends AbstractBaseComponenet {
  pageId: string;

  currentPage = 1;

  autoSearchWhenLoad = true;

  apiParams: ApiOption;

  totalRecords: any;

  itemPerPage = 10;

  maxSize = 3;

  partSearch = true; // 部分検索true, 全検索false
  isPostSearch = true; // post検索true, get検索false

  datas: Array<any> = []; // pageが変更され、リクエストapiが無い場合に使用する。

  allDatas: Array<any> = [];
  // 一覧キャッシュ
  private cacheService: CacheListService;

  constructor(injector: Injector, pageId: string) {
    super(injector);
    this.cacheService = injector.get(CacheListService);
    this.pageId = pageId;
    this.cacheService.listPageId = pageId;
  }

  /**
   * 検索条件のチェック、チェック結果を戻る。
   * @returns boolean: チェック結果
   */
  protected abstract searchVaildate = (): boolean => true;

  /**
   * 検索前に、searchVaildate後に、整理したの検索条件を戻る。
   */
  protected abstract searchBefore = (): ApiOption => { return; };

  /**
   * 検索APIデータ戻る後、データ設定。
   * @param data {any}: API返却のデータ
   */
  protected abstract searchAfter = (data: any) => { };

  /**
   * 編集画面遷移。
   * @param param {any} 編集画面用パラメータ
   */
  protected toEdit = ($event) => { };

  /**
   * 削除処理
   */
  protected toDelete = ($event) => { };

  /**
   * ページネート処理
   */
  protected paginate = ($event: PaginateOptions) => { };

  /**
   * 追加ボタン処理。
   */
  protected toInsert = ($event) => { };

  /**
   * 画面初期化時、保持いるの検索条件設定
   */
  protected initQuery = (cachedQueryInfo) => { };

  /**
   * 画面初期化時、保持いるのページネーションデータ設定。
   */
  protected initPagerInfo = (cachedPagerData: PaginateOptions) => { };

  protected initBefore = (): ApiOption => { return; };

  protected initAfter = (data: any) => { };

  protected validate = () => true;

  protected set cacheData(initData) {
    this.cacheService.setCacheData(this.pageId, initData);
  }

  protected get cacheData() {
    return this.cacheService.getCacheData(this.pageId);
  }

  protected get queryCondition() {
    return this.cacheService.getQueryCache(this.pageId);
  }

  protected set queryCondition(condition) {
    this.cacheService.setQueryCache(this.pageId, condition);
  }
  /**
   * ページネーション。例えば：ページ番号、開始番号、ラスト番号等々。
   */
  protected get pagerInfo() {
    return this.cacheService.getPageInfo(this.pageId);
  }

  protected set pagerInfo(paginatorOption) {
    this.cacheService.setPageInfo(this.pageId, paginatorOption);
  }

  /**
   * 画面初期化時、page初期化
   */
  protected initPage = (currentPage?) => {
    this.pagerInfo = null;
  }

  /**
   * 画面読み込み完了後、保持しるのデータ画面データを設定。
   */
  protected afterViewInit = () => {
    this.initQuery(this.queryCondition);
    this.initMustData().subscribe((resp) => {
      this.searchMustDataAfter(resp);
      if (this.pagerInfo) {
        this.currentPage = this.pagerInfo.currentPage;
      }
      this.initPagerInfo(this.pagerInfo);
      if (this.autoSearchWhenLoad) {
        this.doSearch(false);
      }
    }, (error) => this.handleErrorResponse(error));
  }

  /**
   * 検索処理。
   * 処理概要：
   * 　（１）、searchVaildate呼び出し、チェック処理。
   * 　（２）、（１）でtrue戻る時、searchBefore呼び出し、検索条件を整理。
   * 　（３）、API正常返却時、afterSearch呼び出し、RESTデータを処理。
   * 　（４）、API異常返却時、handleError呼び出し、エラーを処理。
   */
  doSearch = ($event?) => {
    this.errors = null;
    if (this.searchVaildate()) {
      this.apiParams = this.searchBefore();
      if (this.partSearch) {
        if (this.isPostSearch) {
          if (!$event) {
            if (!this.pagerInfo) {
              this.pagerInfo = new PaginateOptions();
            }
            if (!this.pagerInfo.currentPage || this.pagerInfo.currentPage <= 1) {
              this.pagerInfo.currentPage = 1;
              if (this.apiParams && this.apiParams.body) {
                this.apiParams.body['offset'] = 0;
                this.apiParams.body['limit'] = this.itemPerPage;
              }
            } else {
              const _offset = ( this.pagerInfo.currentPage - 1) * this.itemPerPage;
              const _limit = this.itemPerPage;
              if (this.apiParams.body) {
                this.apiParams.body['offset'] = _offset;
                this.apiParams.body['limit'] = _limit;
              } else {
                this.apiParams.body = {};
                this.apiParams.body['offset'] = _offset;
                this.apiParams.body['limit'] = _limit;
              }
            }
          } else {
            this.pagerInfo = null;
            this.currentPage = 1;
            if (this.apiParams && this.apiParams.body) {
              this.apiParams.body['offset'] = 0;
              this.apiParams.body['limit'] = this.itemPerPage;
            }
          }
        } else {
          if (!$event) {
            if (!this.pagerInfo) {
              this.pagerInfo = new PaginateOptions();
            }
            if (!this.pagerInfo.currentPage || this.pagerInfo.currentPage <= 1) {
              this.pagerInfo.currentPage = 1;
              if (this.apiParams && this.apiParams.reqParams) {
                this.apiParams.reqParams.set('offset', 0);
                this.apiParams.reqParams.set('limit', this.itemPerPage);
              }
            } else {
              const _offset = ( this.pagerInfo.currentPage - 1) * this.itemPerPage;
              const _limit = this.itemPerPage;
              if (this.apiParams.reqParams) {
                this.apiParams.reqParams.set('offset', _offset);
                this.apiParams.reqParams.set('limit', _limit);
              } else {
                this.apiParams.reqParams = new Map();
                this.apiParams.reqParams.set('offset', _offset);
                this.apiParams.reqParams.set('limit', _limit);
              }
            }
          } else {
            this.pagerInfo = null;
            this.currentPage = 1;
            if (this.apiParams && this.apiParams.reqParams) {
              this.apiParams.reqParams.set('offset', 0);
              this.apiParams.reqParams.set('limit', this.itemPerPage);
            }
          }
        }
      }

      this.request(this.apiParams)
        .subscribe((resp) => {
          this.searchAfter(resp);
        }, (error) => {
          // this.searchAfter('');
          this.handleErrorResponse(error);
        }
      );
    }
  }

  /**
   * ページネーション時、ページデータ保持。
   */
  doPaginator = ($event) => {
    this.pagerInfo = <PaginateOptions>{
      currentPage: $event['currentPage'] ? $event['currentPage'] : 1,
      first: $event.first,
      rows: $event.rows,
    };
    const _offset = (this.pagerInfo.currentPage - 1) * this.itemPerPage;
    const _limit = this.itemPerPage;
    if (this.isPostSearch) {
      if (this.apiParams.body) {
        this.apiParams.body['offset'] = _offset;
        this.apiParams.body['limit'] = _limit;
      } else {
        this.apiParams.body = {};
        this.apiParams.body['offset'] = _offset;
        this.apiParams.body['limit'] = _limit;
      }
    } else {
      if (this.apiParams.reqParams) {
        this.apiParams.reqParams.set('offset', _offset);
        this.apiParams.reqParams.set('limit', _limit);
      } else {
        this.apiParams.reqParams = new Map();
        this.apiParams.reqParams.set('offset', _offset);
        this.apiParams.reqParams.set('limit', _limit);
      }
    }
    this.request(this.apiParams)
      .subscribe((resp) => {
        this.searchAfter(resp);
      }, (error) => this.handleErrorResponse(error));
      this.currentPage = this.pagerInfo.currentPage;
      this.paginate(this.pagerInfo);
  }

  /**
   * tableとページング部分が分かれている場合 page change
   */
  pageChangedClick = (event) => {
    if (event.page === this.currentPage) {
      return;
    }
    this.currentPage = event.page;
    if (!this.currentPage) {
      this.currentPage = 1;
    }
    const first = (this.currentPage - 1) * event.itemsPerPage;

    this.doPaginator({
      currentPage: this.currentPage,
      first: first,
      rows: event.itemsPerPage
    });
  }

  /**
   * page change、リクエストapiなし、一部データ表示
   */
  localPageChanged(event) {
    if (event.page === this.currentPage || event.currentPage === this.currentPage) {
      return;
    }
    this.currentPage = event.page || event.currentPage;
    if (!this.currentPage) {
      this.currentPage = 1;
    }
    this.setCurrentData();
  }

  doInsert = ($event) => {
    this.toInsert($event);
  }

  /**
   * 編集処理。
   */
  doEdit = ($event) => {
    this.toEdit($event);
  }

  /**
   * 削除ボタン処理。
   */
  doDelete = ($event) => {
    this.toDelete($event);
  }

  /**
   * リクエストapiなし、一部データ表示
   */
  lisData() {
    this.setCurrentData();
  }

  private setCurrentData() {
    this.datas = [];
    if (this.allDatas.length) {
      this.datas = this.itemPerPage ? _.chunk(this.allDatas, this.itemPerPage)[this.currentPage - 1] : this.allDatas;
    }
  }

}
