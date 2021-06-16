/**
 * モジュールレベルのコンポーネントの親クラス。
 * 处理概要：
 * 　メニューまたはそのたモジュールから遷移時、キャッシュクリア。
 *  @version 1.0
 *  @author
 */
import { CacheListService } from '../cache.list.service';
import { CacheInputService } from '../cache.input.service';
import { Injector } from '@angular/core';

export abstract class AbatractCrudComponent {

  // 登録系キャッシュ
  private editCacheService: CacheInputService;

  // リスト系キャッシュ
  private listCacheService: CacheListService;

  constructor(injector: Injector) {
    this.listCacheService = injector.get(CacheListService);
    this.editCacheService = injector.get(CacheInputService);
    this.listCacheService.clear();
    this.editCacheService.clear();
  }
}
