/**
 *  画面 api要求処理機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RestService, RestError, ApiOption} from './http.service';
import { UserInfoService } from './user-info.service';
import { NavigationService } from '../core-components/navigation/navigation.service';
import { Modal, MODAL_TYPE } from '../core-components/modals/modal.component';
import { environment } from '../../../environments/environment';
import { restApi } from '../restapi';
import { I18NService } from './i18n.service';
import { Globals } from '../global';
import * as _ from 'lodash';

export enum RestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  DOWNLOADGET = 'DOWNLOADGET',
}

const ERRORCONTENT = 'エラー';

const httpStatus = {
  400: '共通業務エラーが発生しました。',
  401: '401 Unauthorized: リクエストは、ユーザ認証を必要とする。認証に失敗した時など。',
  402: '402 Payment Required: 将来の使用のために予約されています。',
  403: 'アクセスが拒否されました。',
  404: '404 Not Found: サーバーは、リクエストURIと一致するものを見つけられなかった。アドレスが無くなった時など。',
  405: '405 Method Not Allowed:リクエストに関連付けられている HTTP メソッドがサポートされていません。',
  406: '406 Not acceptable response:コンテンツが見つかりません。',
  407: '407 Proxy Authentication Required: プロキシ認証が必要です。',
  408: '408 Request Timeout: リクエスト送信中にタイムアウトが発生しました。',
  409: '409 Conflict: リクエストは、資源の現在の状態と衝突するために完了できなかった。',
  410: '410 Gone: リクエストに関連付けられたリソースが削除されているため、リクエストを処理できませんでした。',
  411: '411 Length Required: リクエストにContent-Lengthが定義されていません。',
  412: '412 Precondition Failed: HTTP リクエスト ヘッダーで設定された条件が満たされていません。',
  413: '413 Payload Too Large: リクエストで送信されたデータが大きすぎるため、リクエストを処理できませんでした。',
  414: '414 URI Too Long: リクエストURIが長すぎるため、リクエストを処理できませんでした。',
  415: '415 Unsupported Media Type: リクエストで送信されたメディアタイプに対応していないため、リクエストを処理できませんでした。',
  416: '416 Range Not Satisfiable: リクエストで指定された範囲を満たせません。',
  417: '417 Expectation Failed: サーバーが、クライアントの期待値を満たすことができません。',
  421: '421 Misdirected Request: レスポンスを生成できないサーバーにリクエストが送信されました。',
  426: '426 Upgrade Required: 通信プロトコルのアップグレードが必要です。',
  451: '451 Unavailable For Legal Reasons: リクエストされたリソースへのアクセスは禁止されています。',
  500: '500 Internal Server Error: サーバーは、リクエストの実行を妨げる予期しない状況に遭遇した。 CGIスクリプト・エラーなど。',
  501: '501 Not Implemented: リクエストが不明なメソッドまたはオペレーションを実行しようとしたため、リクエストを処理できませんでした。',
  502: '502 Bad Gateway: 不正なゲートウェイです。',
  503: '503 Service Unavailable: 接続エラーによりリクエストを処理できませんでした。',
  504: '504 Gateway Timeout: リクエストがタイムアウトしました。',
  505: '505 HTTP Version Not Supported: リクエストで使用されたHTTPプロトコル・バージョンをサポートしていません。',
};

const VALIDATIONEXCEPTION = 'ValidationException';

const ERR_MESSAGE_MAX = 10;

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private errorMessageResource: any;

  constructor(private restService: RestService,
    private userInfoService: UserInfoService,
    private translate: I18NService,
    private globals: Globals,
    private navigationService: NavigationService) {
      this.translate.getResource('message').subscribe((res: any) => {
        this.errorMessageResource = res;
      });
  }

  doRequest(method: RestType, apiOption: ApiOption): Observable<any> {
    let apiObservable: Observable<any>;
    const apiOpt = _.cloneDeep(apiOption);
    if (!apiOpt) {
      throw new Error('apiOption is empty.');
    }

    if (!apiOpt.apiKey) {
      return new Observable(observer => {
        observer.next('');
        observer.complete();
      });
    }

    // WAIT-DELETE
    const apiKey = environment.testFlag === 'LOCAL_JSON' ? apiOpt.apiKey + '_json' : apiOpt.apiKey;

    // WAIT-DELETE
    if (!restApi[apiKey]) {
      return new Observable(observer => {
        observer.next('');
        observer.complete();
      });
    }

    // WAIT-DELETE
    if (environment['microsoft']) {
      let x;
      try {
        // @ts-ignore
        x = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        x = new XMLHttpRequest();
      }
      x.open('GET', restApi[apiKey], false);
      x.send();

      const jsonRes = JSON.parse(x.responseText);

      return new Observable(observer => {
        observer.next(jsonRes);
        observer.complete();
      });
    }

    // WAIT-DELETE
    apiOpt.apiKey = apiKey;

    apiOpt.headers = this.createHeader(apiOpt.contentType, apiOpt.authorization, apiOpt.apiKey);

    switch (method) {
      case RestType.GET:
        apiObservable = this.doGet(apiOpt);
        break;
      case RestType.PUT:
        apiObservable = this.doPut(apiOpt);
        break;
      case RestType.POST:
        apiObservable = this.doPost(apiOpt);
        break;
      case RestType.DELETE:
        apiObservable = this.doDelete(apiOpt);
        break;
      case RestType.UPLOAD:
        apiObservable = this.doUpload(apiOpt);
        break;
      case RestType.DOWNLOAD:
        apiObservable = this.doDownload(apiOpt);
        break;
      case RestType.DOWNLOADGET:
        apiObservable = this.doDownloadGet(apiOpt);
        break;
      default:
        throw new Error('requestWrapp mehod not supported.');
    }
    return apiObservable;
  }

  doGet(apiOption: ApiOption): Observable<any> {
    return this.restService.get(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doPut(apiOption: ApiOption): Observable<any> {
    return this.restService.put(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doPost(apiOption: ApiOption): Observable<any> {
    return this.restService.post(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doDelete(apiOption: ApiOption): Observable<any> {
    return this.restService.delete(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }


  doUpload(apiOption: ApiOption): Observable<any> {
    const options = this.createHeader('multipart/form-data');
    apiOption.headers = options;

    return this.restService.upload(apiOption).pipe(map((res: Object) => {
      if (res) {
        return res['body'] ? res['body'] : {};
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doDownload(apiOption: ApiOption): Observable<any> {

    apiOption.headers = apiOption.headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.restService.download(apiOption).pipe(map((res: Object) => {
      if (res) {
        const data = res;
        const headers = <HttpHeaders>res['headers'];
        const contentType = headers.get('Content-Type');

        if (this.fileType(contentType)) {
          const contentDisposition = headers.getAll('Content-Disposition');
          let filename = '';
          if (contentDisposition) {
            const strFilename = contentDisposition[0].split(';')[1].split('filename=')[1];
            const filenameEncode = strFilename ? strFilename : contentDisposition[0].split('filename*=')[1];
            try {
              filename = decodeURIComponent(filenameEncode);
            } catch (e) {
              filename = filenameEncode;
            }
         }

          const file = {
            fileName: filename,
            data: data['body']
          };
          return file;
        }
        if (!data) {
          throw new RestError();
        }
        const respText = this.blobToString(data);
        const jsonObj = JSON.parse(respText);
        const common = jsonObj['common'];
      }
      return null;

    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  doDownloadGet(apiOption: ApiOption): Observable<any> {

    apiOption.headers = apiOption.headers.append('X-Requested-With', 'XMLHttpRequest');

    return this.restService.downloadGet(apiOption).pipe(map((res: Object) => {
      if (res) {
        const data = res;
        const headers = <HttpHeaders>res['headers'];
        const contentType = headers.get('Content-Type');

        if (this.fileType(contentType)) {
          const contentDisposition = headers.getAll('Content-Disposition');
          let filename = '';
          if (contentDisposition) {
            const strFilename = contentDisposition[0].split(';')[1].split('filename=')[1];
            const filenameEncode = strFilename.indexOf('?') === -1 ? strFilename : contentDisposition[0].split('filename*=')[1];
            try {
              filename = decodeURIComponent(filenameEncode);
              filename = filename.replace('utf-8\'\'', '');
            } catch (e) {
              filename = filenameEncode;
            }
          }

          const file = {
            fileName: filename,
            data: data['body']
          };
          return file;
        }
        if (!data) {
          throw new RestError();
        }
        const respText = this.blobToString(data);
        const jsonObj = JSON.parse(respText);
        const common = jsonObj['common'];
      }
      return null;
    }),
      catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  fileType(contentType): boolean {
    return contentType.startsWith('text/csv') || // csv
    contentType.startsWith('application/pdf') || // pdf
    contentType.startsWith('application/zip') || // zip
    contentType.startsWith('video/mp4') || // mp4
    contentType.startsWith('video/x-ms-wmv') || // wmv
    contentType.startsWith('image/jpeg') || // jpeg
    contentType.startsWith('image/png') || // png
    contentType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || // xlsx
    contentType.startsWith('application/vnd.ms-excel') || // xls
    contentType.startsWith('application/mp3') || // mp3
    contentType.startsWith('application/octet-stream');
  }

  private createHeader(contentType?: string, authorization?: any, apiKey?: string): HttpHeaders {
    const ct = {
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    };

    if (contentType) {
      ct['Content-Type'] = contentType;
    } else {
      ct['Content-Type'] = 'application/json; charset=UTF-8';
    }
    let header = new HttpHeaders(ct);
    if (authorization) {
      header = header.append('Authorization', authorization);
    }
    // todo
    return header;
  }

  private handleError(error: any): any {
    let errorMessage = '';
    const errorMessageIds = [];
    if (error.error && error.error instanceof Blob) {
      const respText = this.blobToString(error.error);
      const jsonObj = JSON.parse(respText);
      errorMessage = this.messageDisp(jsonObj['errors'], []);
    } else if (<HttpErrorResponse>error && error.error) {
      if (error.error['errors']) {
        errorMessage = this.messageDisp(error.error['errors'], errorMessageIds);
      } else {
        errorMessage = httpStatus[error.status];
      }
    } else if (error.name && error.name === 'TimeoutError') {
      errorMessage = this.errorMessageResource.E090010;
      errorMessageIds.push('E090010');
    }
    this.globals.errorMessageSet.observers = [];
    if (errorMessage !== '') {
      Modal({
        type: MODAL_TYPE.ERROR,
        content: errorMessage,
        onHidden: () => {
          // todo
        }
      });
      throw new RestError(error);
    } else {
      throw new RestError(error);
    }
  }

  private messageDisp(detailMessage: Array<string>, errorMessageIds) {
    let allMessage = '';
    if (detailMessage && detailMessage.length > 0) {
      let max = 0;
      for (let i = 0; i < detailMessage.length; i++) {
        if (max >= ERR_MESSAGE_MAX) { break; }
        allMessage = allMessage ? allMessage + '<br>' : '';
        const messages = detailMessage[i]['messages'];
        if (messages && messages.length > 0) {
          for (let j = 0; j < messages.length; j++) {
            max++;
            allMessage = allMessage + detailMessage[i]['itemName'] + ': ' + messages[j]['content'] + '(' + messages[j]['messageId'] + ')';
            errorMessageIds.push(messages[j]['messageId']);
            if (j !== (messages.length - 1)) {
              allMessage = allMessage + '<br>';
            }
          }
        }
      }
    }
    return allMessage;
  }

  blobToString(b) {
    if (!b) {
      return;
    }
    let u, x;
    u = URL.createObjectURL(b);
    x = new XMLHttpRequest();
    x.open('GET', u, false);
    x.send();
    URL.revokeObjectURL(u);
    return x.responseText;
  }

  get(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.GET, apiOption);
  }

  post(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.POST, apiOption);
  }

  put(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.PUT, apiOption);
  }

  delete(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.DELETE, apiOption);
  }

  downloadPost(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.DOWNLOAD, apiOption);
  }

  downloadGet(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.DOWNLOADGET, apiOption);
  }

  upload(apiOption: ApiOption): Observable<any[]> {
    return this.doRequest(RestType.UPLOAD, apiOption);
  }
}
