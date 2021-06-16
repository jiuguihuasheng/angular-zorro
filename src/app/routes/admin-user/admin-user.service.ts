/**
 * ユーザー機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestApiService, RestType } from '../../common/core-services/rest-api.service';
import { ApiOption } from '../../common/core-base/interface.class';
import { UserListComponent } from './user-list/user-list.component';

@Injectable(
  // {
  //   providedIn: 'root'
  // }
)
export class AdminUserService {

  constructor(private restApiService: RestApiService) {
  }

  searchConditionApiOption(apiKey?: string, urlEndpointParams?: any, body?: any, reqParams?: any): ApiOption {
    const param = <ApiOption>{
      apiKey: apiKey,
      urlEndpointParams: urlEndpointParams,
      reqParams: reqParams,
      body: body,
    };
    return param;
  }

  // 個別詳細
  getUserDetail(apiOpt: any): Observable<any> {
    return this.restApiService.get(apiOpt);
  }

  // ユーザー一覧
  getUserList(apiOpt?: any): Observable<any> {
    return this.restApiService.get(apiOpt);
  }

  // ドライバーを選択
  getDriverList(apiOpt?: any): Observable<any> {
    return this.restApiService.get(apiOpt);
  }

  // ユーザー作成
  userCreate(apiOpt: any): Observable<any> {
    return this.restApiService.post(apiOpt);
  }

  // ユーザー編集
  userEdit(apiOpt?: any): Observable<any> {
    return this.restApiService.post(apiOpt);
  }

  // ユーザー削除
  userDel(apiOpt: any): Observable<any> {
    return this.restApiService.post(apiOpt);
  }

  // ユーザー一括削除
  userBatchDel(param?: any): Observable<any> {
    const apiOpt = <ApiOption>{
      apiKey: 'dap_userBatchDel',
      body: param
    };
    return this.restApiService.post(apiOpt);
  }

  // ユーザー情報ダウンロード
  userDownload(param?: any): Observable<any> {
    const apiOpt = <ApiOption>{
      apiKey: 'dap_userDownload',
      body: param
    };
    return this.restApiService.downloadPost(apiOpt);
  }

  // 顔情報一覧取得
  getFaceInfoList(apiOpt: any): Observable<any> {
    return this.restApiService.get(apiOpt);
  }

  // 顔情報登録
  updFaceInfo(parma?: any): Observable<any> {
    const apiOpt = <ApiOption>{
      apiKey: 'dap_faceInfo',
    };
    return this.restApiService.post(apiOpt);
  }

  // パスワードリセット
  passwordReset(apiOpt: any): Observable<any> {
    return this.restApiService.post(apiOpt);
  }

  // パスワード変更
  passwordChange(parma: any): Observable<any> {
    const apiOpt = <ApiOption>{
      apiKey: 'dap_passwordChange',
      body: parma
    };
    return this.restApiService.post(apiOpt);
  }

  // ログアウト
  logout(): Observable<any> {
    const apiOpt = <ApiOption>{
      apiKey: 'dap_logout'
    };
    return this.restApiService.put(apiOpt);
  }

  // 端末メッセージ：登録
  insDeviceMessageList(parma?: any): Observable<any> {
    const apiOpt = <ApiOption>{
      apiKey: 'dap_deviceMessageIns',
      body: parma
    };
    return this.restApiService.post(apiOpt);
  }

}
