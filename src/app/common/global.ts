/**
 *  グローバル変数機能のクラス
 *  @version 1.0
 *  @author
 */
import { Injectable, EventEmitter } from '@angular/core';

@Injectable(
  {providedIn: 'root'}
)
export class Globals {
  private _title: string;
  private _titleIcon: string;
  private _currentActiveRoute: string;
  private _displayLoading: Array<boolean>;

  private _isMenuClick: boolean;

  errorMessageSet = new EventEmitter();

  constructor() {
    this._displayLoading = [];
  }

  public get currentActiveRoute(): string {
    return this._currentActiveRoute;
  }
  public set currentActiveRoute(value: string) {
    this._currentActiveRoute = value;
  }

  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }

  public get titleIcon(): string {
    return this._titleIcon;
  }
  public set titleIcon(value: string) {
    this._titleIcon = value;
  }

  get displayLoading() {
    return this._displayLoading;
  }

  set displayLoading(displayLoading: any) {
    this._displayLoading = displayLoading;
  }

  set isMenuClick(value: any) {
    this._isMenuClick = value;
  }

  get isMenuClick(): any {
    return this._isMenuClick;
  }

  set errorMessageId(messageIds: any) {
    this.errorMessageSet.emit(messageIds);
  }

}
