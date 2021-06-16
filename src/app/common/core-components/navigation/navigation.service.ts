/**
 *  画面ルーティング、遷移機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavigationStatusService } from './navigation-status.service';
import { Globals } from '../../global';
import * as _ from 'lodash';

declare var ga: any;

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private debug = false;

  private _lastPageParam: any;

  private _pageNameList: any;

  public get lastPageParam(): any {
    return this._lastPageParam;
  }

  public get lastPageName(): any {
    let name;
    if (this._pageNameList && this._pageNameList.length > 0) {
      name = _.nth(this._pageNameList, -2);
    }
    return name;
  }

  constructor(private router: Router,
    private globals: Globals,
    private navigationStatus: NavigationStatusService) {
      this._pageNameList = [];
  }

  navigate(name: string = '', params: any = false, isMenuClick: boolean = false, extras?: NavigationExtras) {
    if (!name) {
      return;
    }
    // google-analytics
    // ga('send', 'pageview', name);
    this._pageNameList.push(name);
    this._lastPageParam = params;
    this.globals.isMenuClick = isMenuClick;
    return this.goTo([name], extras).then(this.beforePageOnInit.bind(this))
      .catch(this.error.bind(this));
  }

  private goTo(commands: any[], extras?: NavigationExtras) {
    this.navigationStatus.canActivate = true;

    return this.router.navigate(commands, extras);
  }


  private error(e) {
    this.log('route not exists', e);
    this.navigationStatus.canActivate = false;
  }

  private beforePageOnInit(status) {
    if (false === status) {
      this.log('route page doesn\'t exists.');
    }
    this.navigationStatus.canActivate = false;
  }

  private log(message: string, data?: any) {
    console.log(message, data);
  }
}
