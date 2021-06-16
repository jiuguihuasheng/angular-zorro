/**
 *  ユーザー登録情報機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { Role } from '../core-components/role.enum';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthInfoService {

  private _userAuth: string;

  public set userAuth(value: string) {
    this._userAuth = value;
  }

  public get userAuth() {
    return this._userAuth;
  }

  constructor() {
  }

  authsCheck(auths: Array<any>): boolean {
    if (_.isEmpty(auths)) {
      return true;
    }
    if (!_.isEmpty(auths) && _.isEmpty(this._userAuth)) {
      return false;
    }
    if (!_.isEmpty(auths) && !_.isEmpty(this._userAuth)) {
      if (_.indexOf(auths, this._userAuth) >= 0) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
