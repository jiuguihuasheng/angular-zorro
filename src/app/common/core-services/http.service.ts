/**
 *  http api要求処理機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { retry } from 'rxjs/internal/operators/retry';
import { catchError } from 'rxjs/internal/operators/catchError';
import { finalize } from 'rxjs/internal/operators/finalize';
import { environment } from '../../../environments/environment';
import { restApi } from '../restapi';
import { Globals } from '../global';
import { timeout } from 'rxjs/operators';

export class HttpError extends Error {
  httpStatus?: number;

  constructor(message?: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class RestError extends HttpError {
  error: HttpErrorResponse;

  constructor(error?: HttpErrorResponse) {
    super(error ? error.message : '');
    this.error = error;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RestError.prototype);
  }
}

export interface ApiOption {
  apiKey: string;
  urlEndpointParams?: Map<string, string>;
  reqParams?: Map<string, string>;
  body?: Object;
  headers?: HttpHeaders;
  contentType?: string;
  params?: any;
  keycloakUrl?: boolean;
  authorization?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private restApi: any;

  private environment: any;

  private jsonWithOutKey = false;

  constructor(
    private http: HttpClient,
    public globals: Globals) {

    this.restApi = restApi;

    this.environment = environment;
  }

  getApiUrl(apiOption: ApiOption, userRestBaseUrl: boolean = true): string {

    let urlEndpoint = this.restApi[apiOption.apiKey];

    if (apiOption.urlEndpointParams) {
      apiOption.urlEndpointParams.forEach((value: string, key: string) => {
        urlEndpoint = urlEndpoint.replace(`{:${key}}`, value);
      });
    }

    let apiParams = '';

    const reqParams = apiOption.reqParams || new Map();
    // reqParams.set('_', new Date().getTime().toString());
    reqParams.forEach((value: string, key: string) => {
      if (_.toString(value)) {
        apiParams = apiParams ? `${apiParams}&${key}=${value}` : `?${key}=${value}`;
      }
    });

    return encodeURI(`${userRestBaseUrl ? this.environment.restBaseUrl : this.environment.restBaseUrlKeycloak}${urlEndpoint}${apiParams}`);
  }

  get(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.globals.displayLoading.push(true);

    const options = {
      headers: apiOption.headers,
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption, !apiOption.keycloakUrl);
    // this.globals.logger.url = apiUrl;
    // this.globals.logger.reqHeader = JSON.stringify(options);

    return this.http.get(apiUrl, options)
      .pipe(retry(this.environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        //   this.globals.logger.respHeader = JSON.stringify(_.omit(res, 'body'));
        //   return this.handleResponse(res);
        // }),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));

  }

  put(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.globals.displayLoading.push(true);

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption);

    if (apiOption.body && Object.keys(apiOption.body).length === 0 && apiOption.body.constructor === Object) {
      apiOption.body = undefined;
    }

    return this.http.put(apiUrl, apiOption.body, options)
      .pipe(retry(this.environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));
  }

  post(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.globals.displayLoading.push(true);

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption, !apiOption.keycloakUrl);

    // if (apiOption.body && Object.keys(apiOption.body).length === 0 && apiOption.body.constructor === Object) {
    //   apiOption.body = undefined;
    // }

    return this.http.post(apiUrl, apiOption.body, options)
      .pipe(retry(this.environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));
  }

  upload(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.globals.displayLoading.push(true);

    const apiUrl = this.getApiUrl(apiOption);

    const options = {
      headers: apiOption.headers,
      observe: 'response' as 'response'
    };

    return this.http.post(apiUrl, apiOption.body, options)
      .pipe(retry(this.environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));
  }

  download(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.globals.displayLoading.push(true);
    const apiUrl = this.getApiUrl(apiOption);

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response',
      responseType: 'blob' as 'blob'
    };

    return this.http.post(apiUrl, apiOption.body, options)
      .pipe(retry(environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Blob>) => this.handledownloadResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));
  }

  downloadGet(apiOption: ApiOption): Observable<HttpResponse<any>> {

    this.globals.displayLoading.push(true);

    const apiUrl = this.getApiUrl(apiOption);

    const options = {
      headers: apiOption.headers ? apiOption.headers : new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' }),
      observe: 'response' as 'response',
      responseType: 'blob' as 'blob'
    };

    return this.http.get(apiUrl, options)
      .pipe(retry(this.environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Blob>) => this.handledownloadResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));
  }

  delete(apiOption: ApiOption): Observable<any[]> {

    this.globals.displayLoading.push(true);

    const options = {
      headers: apiOption.headers,
      observe: 'response' as 'response'
    };

    const apiUrl = this.getApiUrl(apiOption);

    return this.http.delete(apiUrl, options)
      .pipe(retry(this.environment.restRetry),
        timeout(this.environment.timeout),
        map((res: HttpResponse<Object>) => this.handleResponse(res)),
        catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
        finalize(() => {
          this.globals.displayLoading.splice(0, 1);
        }));
  }

  private handledownloadResponse(res: HttpResponse<Blob>): any {
    return { headers: res.headers, body: res.body || '' };

    // let errorMessage = '';
    // errorMessage = httpStatus[res.status];
    // // if (!errorMessage) {
    // //   errorMessage = this.serverErrorMessage;
    // // }

    // // this.modalService.setOptions({
    // //   type: MODAL_TYPE.ERROR,
    // //   header: ERRORCONTENT,
    // //   message: errorMessage
    // // });

    // const err = new HttpError(errorMessage);
    // err.httpStatus = res.status;
    // throw err;
  }


  private handleResponse(res: HttpResponse<Object>): any {
    return { headers: res.headers, body: res.body || '' };
  }

  private handleHttpError(error: HttpErrorResponse): any {
    throw error;
  }
}
