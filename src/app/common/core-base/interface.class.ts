/**
 *  api クラス 分页クラス
 *  @version 1.0
 *  @author
 */
import { HttpHeaders } from '@angular/common/http';

export interface ApiOption {
  apiKey: string;
  urlEndpointParams?: Map<string, string>;
  reqParams?: Map<string, any>;
  body?: Object;
  headers?: HttpHeaders;
  params?: any;
}

export class PaginateOptions {
  currentPage: number;
  first?: number;
  rows?: number;
}

