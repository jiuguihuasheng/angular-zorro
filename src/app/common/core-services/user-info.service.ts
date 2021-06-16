/**
 *  ユーザー登録情報機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthInfoService } from './auth-info.service';

export class UserInfo {
  userId: string; // アカウントID
  userName: string; // 氏名
  permissions: Array<string>; // 権限
  enterpriseName: string; // 企業名
  enterpriseId: string; // 企業ID
  organizationName: string; // 組織名
  organization: Array<string>; // 組織
  organizationId: string; // 組織ID
  lastLoginTime: string; // 最終ログイン日時
  initUser: boolean;
  agreementFlag: boolean; // 同意フラグ

  constructor() {
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  public $roleCodeLoad = new BehaviorSubject<any>('');

  private _userInfo: UserInfo;

  public set userInfo(value: UserInfo) {
    this._userInfo = value;
  }

  public get userInfo(): UserInfo {
    return this._userInfo;
  }

  private _token: string;

  public get token(): string {
    return this._token;
  }
  public set token(value: string) {
    this._token = value;
  }

  private _oidcAccesstoken: any;

  public get oidcAccesstoken(): any {
    return this._oidcAccesstoken;
  }
  public set oidcAccesstoken(value: any) {
    this._oidcAccesstoken = value;
  }

  private _oidcData: any;

  public get oidcData(): any {
    return this._oidcData;
  }
  public set oidcData(value: any) {
    this._oidcData = value;
  }

  private _currPermission: string;

  public get currPermission(): string {
    return this._currPermission;
  }
  public set currPermission(value: string) {
    this._currPermission = value;
    this.authInfoService.userAuth = value;
  }

  private _keycloakUserId: string;

  public get keycloakUserId(): string {
    return this._keycloakUserId;
  }
  public set keycloakUserId(value: string) {
    this._keycloakUserId = value;
  }

  constructor(private authInfoService: AuthInfoService) { }
}
