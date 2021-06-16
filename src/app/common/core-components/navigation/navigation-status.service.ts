/**
 *  画面flagに入ることができる
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStatusService {

  private _canActivate = false;

  constructor() {
  }

  get canActivate() {
    return this._canActivate;
  }

  set canActivate(canActivate: any) {
    this._canActivate = canActivate;
  }
}
