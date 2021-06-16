/**
 *  単項目チェック
 *  @version 1.0
 *  @author
 */
import {
  Directive,
  QueryList,
  Input,
  ContentChildren,
  AfterContentInit,
  Injectable,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone,
  Renderer2,
  Host
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { DomHandler } from '../dom/domhandler';
import { VALID_MESSAGE } from './validMessage';
import * as _ from 'lodash';


@Injectable()
export class ValidateComponent {
  constructor() { }
}


export const RULES = {
  // 必須チェック
  REQUIRED: 'required',
  // 英数字のみチェック
  ALPHANUMERIC: 'alphanumeric',
  // 半角英数記号
  ALPHANUMERICANDSYMBOLS: 'alphanumericAndSymbols',
  // 半角英数字と"."
  ALPHANUMERICANDDOT: 'alphanumericAnddot',
  // 半角数字と"-"
  NUMERICANDHYPHENS: 'numericAndhyphens',
  // 半角英数字(アルファベットは大文字)
  ALPHANUMERICUPPER: 'alphanumericupper',
  // 正の整数のみチェック
  NUMERIC: 'numeric',
  // 半角数字及び半角スペース
  NUMERICSPACE: 'numericSpace',
  // 数値のみチェック
  NUMERAL: 'numeral',
  // 電話番号 電話番号(XXXX-XXXX)
  TEL: 'tel',
  // Eメールチェック
  EMAIL: 'email',
  // URLチェック
  URL: 'url',
  // URLチェック
  ZIPCODE: 'zipcode',
  // 最大長チェック
  MAXLENGTH: 'maxlength',
  // 最小長チェック
  MINLENGTH: 'minlength',
  // 指定範囲チェック
  RANGE: 'range',
  // 指定フォーマットチェック
  REGEX: 'regex',
  // 全角のみチェック
  ZENKAKU: 'zenkaku',
  // 全角漢字、ひらがな、カタカナのみチェック
  ZENKAKUKANJI: 'zenkakuKanji',
  // ひらがな文字(全角)または、アルファベット文字(半角[a-zA-Z])
  HIRAGANAALPHA: 'hiraganaAlpha',
  // 半角のみチェック
  HANKAKU: 'hankaku',
  // 半角英数字、半角カナ及びハイフンのみチェック
  HANKAKUANDHYPHENS: 'hankakuandhyphens',
  // 全角、半角ｶﾅ及び半角英数字
  ZENKAKUHANKAKUALPHANUMERIC: 'zenkakuhankakualphanumeric',
  // 片仮名のみチェック
  KATAKANA: 'katakana',
  // 日本語は全角、英数字記号は半角入力
  ALPHANUMERICORZENKAKU: 'alphanumericOrZenkaku',
  // カスタム仕様（function）チェック
  FUNC: 'func',
  // password check
  PASSWORD: 'password',
  // ユーザーID
  USERID: 'userId',
  // 金額
  MONEY: 'money',
  // 指定小数桁数
  STEP: 'step',
  // 全角のひらがなは禁止
  ZENKAKUHIRAGA: 'zenkakuHiraGa',
  // Number range
  NUMBERRANGE: 'numberRange',
  // Number range
  EQUALLENGTH: 'equalLength',
  // 全角もしくは半角数字
  NUMERICORZENKAKU: 'numericOrZenkaku',
  // 半角カタカナ
  HANKAKUKATAKANA: 'hankakukatakana',
  // 半角カナ英字（大文字のみ）
  HANKAKUKATAKANAUPPER: 'hankakukatakanaupper',
};

export const ERROR_MESSAGE = {
  [RULES.REQUIRED]: VALID_MESSAGE.E000010, // '必須入力項目です。',
  [RULES.ALPHANUMERIC]: VALID_MESSAGE.E000020, // '半角英数字で入力してください。',
  [RULES.NUMERIC]: VALID_MESSAGE.E000060, // '半角数字で入力してください。',
  [RULES.NUMERICSPACE]: VALID_MESSAGE.E000260, // '半角数字及び半角スペース入力してください。',
  [RULES.NUMERAL]: VALID_MESSAGE.E000060, // '半角数字で入力してください。',
  [RULES.ALPHANUMERICANDSYMBOLS]: VALID_MESSAGE.E000050, // '半角英数字記号で入力してください。',
  [RULES.ALPHANUMERICANDDOT]: VALID_MESSAGE.E000190, // '半角英数字及び"."で入力してください。',
  [RULES.NUMERICANDHYPHENS]: VALID_MESSAGE.E000230, // '半角数字及びハイフンで入力してください。',
  [RULES.ALPHANUMERICUPPER]: VALID_MESSAGE.E000210, // '半角英数字(アルファベットは大文字)及び半角スペースで入力ください。',
  [RULES.EMAIL]: VALID_MESSAGE.E000100, // '有効なメールアドレスではありません。',
  [RULES.TEL]: '有効な電話番号ではありません。',
  [RULES.URL]: 'URLリンクに入力されたURLは不正です。',
  [RULES.ZIPCODE]: '有効な郵便番号ではありません。',
  [RULES.MINLENGTH]: VALID_MESSAGE.E000110, // '{0}文字以上で入力してください。',
  [RULES.MAXLENGTH]: VALID_MESSAGE.E000070, // '{0}文字以内で入力して下さい。',
  [RULES.EQUALLENGTH]: VALID_MESSAGE.E000120, // '{0}桁入力してください。',
  [RULES.RANGE]: VALID_MESSAGE.E000080, // '{0}以上、{1}以内で入力してください。',
  [RULES.STEP]: '小数{0}桁数以内で入力してください。',
  [RULES.REGEX]: '正規表現データではありません。',
  [RULES.ZENKAKU]: VALID_MESSAGE.E000130, // '全角ではありません。',
  [RULES.ZENKAKUHANKAKUALPHANUMERIC]: VALID_MESSAGE.E000200, // '全角、半角ｶﾅ及び半角英数字で入力してください。',
  [RULES.ZENKAKUKANJI]: VALID_MESSAGE.E000160, // '日本語全角を入力してください。', // (英数字は入力できません)
  [RULES.HIRAGANAALPHA]: VALID_MESSAGE.E000170, // '全角ひらがなまたは半角アルファベットを入力してください。',
  [RULES.ZENKAKUHIRAGA]: '全角カナを入力してください。',
  [RULES.HANKAKU]: VALID_MESSAGE.E000140, // '半角ではありません。',
  [RULES.HANKAKUANDHYPHENS]: VALID_MESSAGE.E000240, // '半角英数字、半角カナ及びハイフンで入力してください。',
  [RULES.KATAKANA]: 'カタカナではありません。',
  [RULES.ALPHANUMERICORZENKAKU]: '日本語なら全角、英数字記号なら半角で入力してください。',
  [RULES.FUNC]: '正しいデータを入力してください。',
  [RULES.PASSWORD]: VALID_MESSAGE.E000150, // '有効なパスワードではありません。',
  [RULES.USERID]: '有効なユーザーIDではありません。',
  [RULES.MONEY]: '数値のみで入力してください。',
  [RULES.NUMBERRANGE]: VALID_MESSAGE.E000180, // '{0}以上、{1}以内で入力してください。',
  [RULES.NUMERICORZENKAKU]: '日本語なら全角、数字なら半角で入力してください。',
  [RULES.HANKAKUKATAKANA]: VALID_MESSAGE.E000250, // 半角ｶﾅ及び半角スペースで入力ください。
  [RULES.HANKAKUKATAKANAUPPER]: VALID_MESSAGE.E000220, // 半角ｶﾅ、半角英字（大文字のみ）及び半角スペースで入力ください。
};

const COM_LIST = {
  LABEL: 'label',
  DIV: 'div',
  TD: 'td',
  DD: 'dd',
  NZDATEPICKER: 'nz-date-picker'
};

@Directive({
  // tslint:disable-next-line
  selector: '[cpValid]',
  providers: [DomHandler],
})
export class ValidDirective implements AfterViewInit, OnDestroy {

  @Input() name: string;

  @Input() emptyValue: any;

  @Input() tooltipPosition = 'top';

  @Input() appendTo: any = 'body';

  @Input() positionStyle = 'absolute';

  @Input() tooltipStyleClass: string;

  @Input() tooltipZIndex = 'auto';

  @Input() tooltipDisabled: boolean;

  @Input() escape = true;

  @Input() showDelay: number;

  @Input() hideDelay: number;

  @Input() life: number;

  @Input() appendToParent = true;

  @Input() componentValue = '';

  @Input() doNotCheck = false;

  @Input() isTableCell = false;

  container: any;

  styleClass: string;

  tooltipText: any;

  showTimeout: any;

  hideTimeout: any;

  active: boolean;

  mouseEnterListener: Function;

  mouseLeaveListener: Function;

  mouseoverListener: Function;

  clickListener: Function;

  focusListener: Function;

  blurListener: Function;

  resizeListener: any;

  defaultErrorMsgs = ERROR_MESSAGE;

  private _rule;

  private doInit = false;

  private isCheckboxVaild = false;

  private isRadioboxVaild = false;

  private errorArray: Array<string> = [];

  private localName: string;

  private checkboxList: any;

  private radioboxList: any;

  private showAllMsg: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private domHandler: DomHandler,
    public zone: NgZone,
    @Host() private validateDirective: ValidateDirective
  ) {
    this.localName = this.el.nativeElement.localName;
    if (this.localName === COM_LIST.DIV || this.localName === COM_LIST.LABEL) {
      this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.focusListener = this.onFocus.bind(this);
      this.el.nativeElement.addEventListener('focus', this.focusListener);
      this.blurListener = this.onBlur.bind(this);
      this.el.nativeElement.addEventListener('blur', this.blurListener);
      this.mouseoverListener = this.onHover.bind(this);
      this.el.nativeElement.addEventListener('mouseover', this.mouseoverListener);
      this.mouseLeaveListener = this.onLeave.bind(this);
      this.el.nativeElement.addEventListener('mouseout', this.mouseLeaveListener);
    });
    if (this.validateDirective && this.validateDirective.rules) {
      const rules = new Map(this.validateDirective.rules);
      this.rule = rules.get(this.name);
    }
    if (this.appendToParent) {
      this.appendTo = this.el.nativeElement.parentElement;
    } else {
      this.appendTo = this.el.nativeElement;
    }
  }

  onFocus(e: any) {
    this.activate();
  }

  onBlur(e: Event) {
    this.deactivate();
    this.check(false);
  }

  onHover(e: Event) {
    this.activate();
  }

  onLeave(e: Event) {
    this.deactivate();
  }

  public get rule() {
    return this._rule;
  }
  public set rule(value) {
    this._rule = value;
  }

  addErrMsg(msg: string) {
    this.errorArray.push(msg);
  }

  get errorMsg() {
    // let errmsg = '';
    // for (const msg of this.errorArray) {
    //   errmsg = errmsg ? `${errmsg}\n${msg}` : msg;
    // }
    if (this.errorArray && this.errorArray.length > 0) {
      return this.errorArray[0];
    }
    return '';
  }

  check(showAllMsg: boolean = true) {
    this.showAllMsg = showAllMsg;
    if (this.doNotCheck) {
      return true;
    }

    this.clear();
    const rule = this.rule;
    if (!rule) {
      throw new Error('validate rule is not exist, name: ' + this.name);
    }

    let value = '';

    value = this.el.nativeElement.localName === COM_LIST.LABEL ?
      this.el.nativeElement.getAttribute('value') : this.el.nativeElement.value;

    if (this.el.nativeElement.localName === COM_LIST.NZDATEPICKER) {
      value = this.el.nativeElement.querySelector('input').value;
    }

    if (this.componentValue) {
      value = this.componentValue;
    }

    if (this.el.nativeElement.disabled) {
      return;
    }

    this.checkboxList = this.el.nativeElement.querySelectorAll('input[type=checkbox]');
    if (this.checkboxList && this.checkboxList.length > 0) {
      this.isCheckboxVaild = true;
    }

    this.radioboxList = this.el.nativeElement.querySelectorAll('input[type=radio]');
    if (this.radioboxList && this.radioboxList.length > 0) {
      this.isRadioboxVaild = true;
    }

    const input = this.el.nativeElement.querySelector('input');
    if (input && input.disabled) {
      return;
    }


    if (rule) {
      const checkTypes = Object.keys(rule);
      checkTypes.forEach(type => {
        let ischeck = true;
        // tslint:disable-next-line
        let { err, condition } = this.analysisCondition(type, rule[type]);
        switch (type) {
          case RULES.REQUIRED:
            if (this.isCheckboxVaild) {
              ischeck = false;
              for (let i = 0; i < this.checkboxList.length; i++) {
                if (this.checkboxList[i].checked) {
                  ischeck = true;
                  return;
                }
              }
            } else if (this.isRadioboxVaild) {
              ischeck = false;
              for (let i = 0; i < this.radioboxList.length; i++) {
                if (this.radioboxList[i].checked) {
                  ischeck = true;
                  return;
                }
              }
            } else {
              if (!value) {
                ischeck = false;
                break;
              }
              if (
                (_.isObject(value) && _.isEmpty(value)) ||
                (_.isArray(value) && value.length === 0) ||
                (this.emptyValue && this.emptyValue === value)) {
                ischeck = false;
              }
            }
            break;
          case RULES.MINLENGTH:
            if (value && value.length < condition) {
              ischeck = false;
            }
            break;
          case RULES.MAXLENGTH:
            if (value && value.length > condition) {
              ischeck = false;
            }
            break;
          case RULES.EQUALLENGTH:
            if (value && value.length !== condition) {
              ischeck = false;
            }
            break;
          case RULES.TEL:
            if (value && !/^([0-9]{1,20}-){1,5}[0-9]{1,20}$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.EMAIL:
            // tslint:disable-next-line
            const reg = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
            if (value && !reg.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ALPHANUMERIC:
            if (value && !/^[\w\d]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ALPHANUMERICANDSYMBOLS:
            if (value && !/^[\w\d -/:-@\\[-`{-~]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ALPHANUMERICANDDOT:
            if (value && !/^[\w\d.]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.NUMERICANDHYPHENS:
            if (value && !/^[0-9-]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ALPHANUMERICUPPER:
            if (value && !/^[A-Z0-9 ]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ALPHANUMERICORZENKAKU:
            if (!value) {
              ischeck = true;
              break;
            }
            // tslint:disable-next-line
            if (/.*([\uFF41-\uFF5A\uFF21-\uFF3A\uFF10-\uFF19]|[\uFF01\u201D\uFF03\uFF04\uFF05\uFF06\u2019\uFF0A\uFF0B\uFF0C\uFF0D\uFF0E\uFF0F\uFF1A\uFF1B\uFF1C\uFF1D\uFF1E\uFF1F\uFF20\uFF3B\uFFE5\uFF3D\uFF3E\uFF3F\u2018\uFF5B\uFF5C\uFF5D\uFFE3]|[\uFF61\uFF64\uFF66-\uFF9F]).*/.test(value)) {
              ischeck = false;
              break;
            }
            ischeck = true;
            break;
          case RULES.NUMERICORZENKAKU:
            if (!value) {
              ischeck = true;
              break;
            }

            // tslint:disable-next-line
            if (value && (!/^[0-9]+$/.test(value) && !/^[\u3005\u3007\u303B\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF\u3041-\u3096\u30A1-\u30FAa-zA-Z0-9 -/:-@\\[-`{-~]+$/.test(value))) {
              ischeck = false;
              break;
            }
            ischeck = true;
            break;
          case RULES.URL:
            if (value && !/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.NUMERIC:
            if (value && !/^[0-9]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.NUMERICSPACE:
            if (value && !/^[0-9 ]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.NUMERAL:
            if (value && !/^(-|\+)?\d+(\.\d+)?$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.RANGE:
            const [START, END] = condition;
            if (value && !(value.length >= START && value.length <= END)) {
              ischeck = false;
            }
            break;
          case RULES.REGEX:
            if (typeof condition !== 'object') {
              // console.warn(`${this.name}'s rule is not regex.`);
            }

            if (value && !condition.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ZENKAKU:
            // tslint:disable-next-line
            if (value && !/^[^ -~｡-ﾟ]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ZENKAKUKANJI:
            if (!value) {
              ischeck = true;
              break;
            }
            //  ひらがな 3040-309F カタカナ 30A0-30FF 漢字 [々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]
            if (/^[々〇〻\u3400-\u9FFF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF]+$/.test(value)) {
              ischeck = true;
              break;
            }
            if (/^[\uD840-\uD87F][\uDC00-\uDFFF]+$/.test(value)) {
              ischeck = true;
              break;
            }
            ischeck = false;
            break;
          case RULES.HIRAGANAALPHA:
            if (value && !/^[a-zA-Z\u3040-\u309F]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.HANKAKU:
            if (value && !/^[\uff70-\uff9d\uff9e\uff9f\uff67-\uff6fa-zA-Z0-9!"@\ \#\$\%\&\'\(\)\=\-\~\^\|\\\_\?\>\<\,\.\/]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.HANKAKUANDHYPHENS:
            if (value && !/^[\uff70-\uff9d\uff9e\uff9f\uff67-\uff6fa-zA-Z0-9-/]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.ZENKAKUHANKAKUALPHANUMERIC:
            const patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
            if (value && patrn.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.FUNC:
            if (typeof condition !== 'function') {
              // console.warn(`${this.name}'s rule is not function`);
            }
            const result = condition(value);
            if (result === undefined || result === null) {
              ischeck = false;
              break;
            }
            if (result === false) {
              ischeck = false;
            }
            if (typeof result === 'string' && result.length > 0) {
              ischeck = false;
              err = result;
            }
            if (_.isArray(result) && result.length > 0) {
              ischeck = false;
              const resultCond = result.shift();
              err = this.format(resultCond, [...result]);
            }
            break;
          case RULES.KATAKANA:
            if (value && !/^[\u30a1-\u30f6]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.PASSWORD:
            if (!value) {
              ischeck = true;
              break;
            }
            // tslint:disable-next-line
            if (!/^[A-Za-z0-9\$\%\(\)\*\+\,\-\.\/\:\;\=\?\@\[\\\]\^\_\`\{\|\}\~\!]+$/.test(value)) {
              ischeck = false;
              break;
            }

            let strength = 0;
            if (/\d+/.test(value)) {
              strength++;
            }
            if (/[a-z]+/.test(value)) {
              strength++;
            }
            if (/[A-Z]+/.test(value)) {
              strength++;
            }
            if (/[\$\%\(\)\*\+\,\-\.\/\:\;\=\?\@\[\\\]\^\_\`\{\|\}\~\!]+/.test(value)) {
              strength++;
            }
            if (strength < 4) {
              ischeck = false;
            } else {
              ischeck = true;
            }
            break;
          case RULES.USERID:
            if (!value) {
              ischeck = true;
              break;
            }
            // tslint:disable-next-line
            if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
              ischeck = false;
              break;
            }

            break;
          case RULES.MONEY:
            if (!value) {
              ischeck = true;
              break;
            }
            ischeck = true;
            const parts = value.split(',');
            for (const part of parts) {
              if (!part || !/^[0-9]+$/.test(part)) {
                ischeck = false;
                break;
              }
            }
            break;
          case RULES.HANKAKUKATAKANA:
            if (value && !/^[\uff70-\uff9d\uff9e\uff9f\uff67-\uff6f ]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.HANKAKUKATAKANAUPPER:
            if (value && !/^[A-Z\uff70-\uff9d\uff9e\uff9f\uff67-\uff6f ]+$/.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.STEP:
            const [STEP] = condition;
            const expression = '^\\d+(\\.\\d{1,' + STEP + '})?$';
            const reg1 = new RegExp(expression);
            if (!reg1.test(value)) {
              ischeck = false;
            }
            break;
          case RULES.NUMBERRANGE:
            const [MIN, MAX] = condition;
            if (value) {
              let num = null;
              if (_.isNumber(value)) {
                num = value;
              } else {
                num = _.toNumber(value);
              }
              if (num < MIN || num > MAX) {
                ischeck = false;
              }
            }
            break;
        }
        if (!ischeck) {
          this.addErrMsg(err);
        }
      });
    }
    // if (this.errorMsg) {
    //   this.addRedBox();
    // } else {
    //   this.deactivate();
    // }
    if (this.errorMsg) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  analysisCondition(type: string, condition: any) {
    let err = '';
    switch (type) {
      case RULES.REQUIRED:
      case RULES.TEL:
      case RULES.EMAIL:
      case RULES.URL:
      case RULES.ALPHANUMERIC:
      case RULES.ALPHANUMERICANDSYMBOLS:
      case RULES.ALPHANUMERICANDDOT:
      case RULES.NUMERICANDHYPHENS:
      case RULES.ALPHANUMERICUPPER:
      case RULES.ZENKAKUHANKAKUALPHANUMERIC:
      case RULES.NUMERIC:
      case RULES.NUMERICSPACE:
      case RULES.NUMERAL:
      case RULES.HANKAKU:
      case RULES.HANKAKUANDHYPHENS:
      case RULES.ZENKAKU:
      case RULES.HIRAGANAALPHA:
      case RULES.ZENKAKUKANJI:
      case RULES.KATAKANA:
      case RULES.HANKAKUKATAKANA:
      case RULES.HANKAKUKATAKANAUPPER:
      case RULES.MONEY:
        if (typeof condition !== 'boolean') {
          err = condition;
        }
        break;
      case RULES.MINLENGTH:
      case RULES.MAXLENGTH:
      case RULES.EQUALLENGTH:
      case RULES.REGEX:
      case RULES.FUNC:
        if (Array.isArray(condition) && condition.length === 2) {
          if (typeof condition[1] !== 'boolean') {
            err = condition[1];
          }
          condition = condition[0];
        }
        break;
      case RULES.RANGE:
      case RULES.STEP:
      case RULES.NUMBERRANGE:
        if (Array.isArray(condition[0])) {
          if (typeof condition[1] !== 'boolean') {
            err = condition[1];
          }
          condition = condition[0];
        }
        break;
      default:
        err = this.defaultErrorMsgs[type];
        break;
    }

    if (!err) {
      err = this.prepareErrorMsg(type, condition);

    }
    return { err, condition };
  }

  scroll(isScroll: boolean) {
    if (isPlatformBrowser && isScroll) {
      const elRect = this.el.nativeElement.getBoundingClientRect();

      let toTopPos = elRect['top'] - 70;  // TODO
      toTopPos = toTopPos < 0 ? 0 : toTopPos;
      window.scrollTo(0, toTopPos);
    }
    if (!this.el.nativeElement.className || this.el.nativeElement.className.indexOf('no-focus') < 0) {
      const localName = this.el.nativeElement.localName;
      switch (localName) {
        default:
          this.el.nativeElement.focus();
          break;
      }
    }
  }

  private prepareErrorMsg(type: string, cond: any): string {
    let err = '';
    switch (type) {
      case RULES.MINLENGTH:
      case RULES.MAXLENGTH:
      case RULES.EQUALLENGTH:
        err = this.format(this.defaultErrorMsgs[type], [cond]);
        break;
      case RULES.RANGE:
      case RULES.STEP:
      case RULES.NUMBERRANGE:
        const condition = cond;
        err = this.format(this.defaultErrorMsgs[type], condition);
        break;
      default:
        err = this.defaultErrorMsgs[type];
    }
    return err;
  }

  format(str: string, replacements: Array<string>): string {
    return str.replace(/\{(\d+)\}/g, function () {
      return replacements[arguments[1]];
    });
  }


  getScrollTop = () => {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }

  getElPosition = () => {
    const cliectRect = this.el.nativeElement.getBoundingClientRect();
    return cliectRect;
  }

  clear() {
    this.errorArray = [];
    this.doInit = true;
    this.deactivate();
    this.doInit = false;
  }


  // ****************************************** Tooltip *****************************************/
  activate() {
    this.active = true;
    this.clearHideTimeout();

    if (this.showDelay) {
      this.showTimeout = setTimeout(() => { this.show(); }, this.showDelay);
    } else {
      this.show();
    }
    if (this.life) {
      const duration = this.showDelay ? this.life + this.showDelay : this.life;
      this.hideTimeout = setTimeout(() => { this.hide(); }, duration);
    }
  }

  deactivate() {
    this.active = false;
    this.clearShowTimeout();

    if (this.hideDelay) {
      this.clearHideTimeout();    // life timeout
      this.hideTimeout = setTimeout(() => { this.hide(); }, this.hideDelay);
    } else {
      this.hide();
    }
  }

  create() {
    if (this.container) {
      this.updateText();
      return;
    } else {
      this.container = document.createElement('div');
    }
    const tooltipArrow = document.createElement('div');
    tooltipArrow.className = 'cp-tooltip-arrow';
    this.container.appendChild(tooltipArrow);

    this.tooltipText = document.createElement('div');
    this.tooltipText.className = 'cp-tooltip-text cp-shadow cp-corner-all';

    this.updateText();

    if (this.positionStyle) {
      this.container.style.position = this.positionStyle;
    }

    this.container.appendChild(this.tooltipText);

    if (this.appendTo === 'body') {
      document.body.appendChild(this.container);
    } else if (this.appendTo === 'target') {
      this.domHandler.appendChild(this.container, this.el.nativeElement);
    } else {
      this.domHandler.appendChild(this.container, this.appendTo);
    }
    const targetEl = this.el.nativeElement;
    this.domHandler.removeClass(targetEl, 'valid');
    this.domHandler.addClass(targetEl, 'invalid');
    this.container.style.display = 'inline-block';
  }

  show() {
    if (!this.errorMsg || this.tooltipDisabled) {
      return;
    }

    this.create();
    this.align();
    this.domHandler.fadeIn(this.container, 250);

    if (this.tooltipZIndex === 'auto') {
      this.container.style.zIndex = ++DomHandler.zindex;
    } else {
      this.container.style.zIndex = this.tooltipZIndex;
    }
    this.bindDocumentResizeListener();
  }

  hide() {
    this.remove();
  }

  updateText() {
    if (this.escape) {
      this.tooltipText.innerHTML = '';
      this.tooltipText.appendChild(document.createTextNode(this.errorMsg));
    } else {
      this.tooltipText.innerHTML = this.errorMsg;
    }
  }

  align() {
    const position = this.tooltipPosition;
    switch (position) {
      case 'top':
        this.alignTop();
        if (this.isOutOfBounds()) {
          this.alignBottom();
        }
        break;

      case 'bottom':
        this.alignBottom();
        if (this.isOutOfBounds()) {
          this.alignTop();
        }
        break;

      case 'left':
        this.alignLeft();
        if (this.isOutOfBounds()) {
          this.alignRight();

          if (this.isOutOfBounds()) {
            this.alignTop();

            if (this.isOutOfBounds()) {
              this.alignBottom();
            }
          }
        }
        break;

      case 'right':
        this.alignRight();
        if (this.isOutOfBounds()) {
          this.alignLeft();

          if (this.isOutOfBounds()) {
            this.alignTop();

            if (this.isOutOfBounds()) {
              this.alignBottom();
            }
          }
        }
        break;
    }
  }

  getHostOffset() {
    if (this.appendTo === 'body' || this.appendTo === 'target') {
      const offset = this.el.nativeElement.getBoundingClientRect();
      const targetLeft = offset.left + this.domHandler.getWindowScrollLeft();
      const targetTop = offset.top + this.domHandler.getWindowScrollTop();

      return { left: targetLeft, top: targetTop };
    } else {
      const el = this.el.nativeElement;
      return { left: el.offsetLeft, top: el.offsetTop };
    }
  }

  alignRight() {
    this.preAlign('right');
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + this.domHandler.getOuterWidth(this.el.nativeElement);
    const top = hostOffset.top + (this.domHandler.getOuterHeight(this.el.nativeElement)
      - this.domHandler.getOuterHeight(this.container)) / 2;
    this.container.style.left = left + 'px';
    this.container.style.top = top + 'px';
  }

  alignLeft() {
    this.preAlign('left');
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left - this.domHandler.getOuterWidth(this.container);
    const top = hostOffset.top + (this.domHandler.getOuterHeight(this.el.nativeElement)
      - this.domHandler.getOuterHeight(this.container)) / 2;
    this.container.style.left = left + 'px';
    this.container.style.top = top + 'px';
  }

  alignTop() {
    this.preAlign('top');
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + (this.domHandler.getOuterWidth(this.el.nativeElement)
      - this.domHandler.getOuterWidth(this.container)) / 2;
    const top = hostOffset.top - this.domHandler.getOuterHeight(this.container);
    this.container.style.left = left + 'px';
    this.container.style.top = top + 'px';
  }

  alignBottom() {
    this.preAlign('bottom');
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + (this.domHandler.getOuterWidth(this.el.nativeElement)
      - this.domHandler.getOuterWidth(this.container)) / 2;
    const top = hostOffset.top + this.domHandler.getOuterHeight(this.el.nativeElement);
    this.container.style.left = left + 'px';
    this.container.style.top = top + 'px';
  }

  preAlign(position: string) {
    this.container.style.left = -999 + 'px';
    this.container.style.top = -999 + 'px';

    const defaultClassName = 'cp-tooltip cp-widget cp-tooltip-' + position;
    this.container.className = this.tooltipStyleClass ? defaultClassName + ' ' + this.tooltipStyleClass : defaultClassName;
  }

  isOutOfBounds(): boolean {
    const offset = this.container.getBoundingClientRect();
    const targetTop = offset.top;
    const targetLeft = offset.left;
    const width = this.domHandler.getOuterWidth(this.container);
    const height = this.domHandler.getOuterHeight(this.container);
    const viewport = this.domHandler.getViewport();

    return (targetLeft + width > viewport.width) || (targetLeft < 0) || (targetTop < 0) || (targetTop + height > viewport.height);
  }

  onWindowResize(e: Event) {
    this.hide();
  }

  bindDocumentResizeListener() {
    this.zone.runOutsideAngular(() => {
      this.resizeListener = this.onWindowResize.bind(this);
      window.addEventListener('resize', this.resizeListener);
    });
  }

  unbindDocumentResizeListener() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  unbindEvents() {
    this.el.nativeElement.removeEventListener('focus', this.focusListener);
    this.el.nativeElement.removeEventListener('blur', this.blurListener);
    this.unbindDocumentResizeListener();
  }

  remove() {
    if (this.container && this.container.parentElement) {
      if (this.appendTo === 'body') {
        document.body.removeChild(this.container);
      } else if (this.appendTo === 'target') {
        this.el.nativeElement.removeChild(this.container);
      } else {
        this.domHandler.removeChild(this.container, this.appendTo);
      }
    }
    const targetEl = this.el.nativeElement;
    if (!this.errorMsg) {
      this.domHandler.removeClass(targetEl, 'invalid');
      if (!this.isCheckboxVaild && !this.isRadioboxVaild) {
        this.domHandler.addClass(targetEl, 'valid');
      }
    }
    if (this.doInit) {
      this.domHandler.removeClass(targetEl, 'invalid');
      this.domHandler.removeClass(targetEl, 'valid');
    }

    this.unbindDocumentResizeListener();
    this.clearTimeouts();
    this.container = null;
  }

  clearShowTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  clearTimeouts() {
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  ngOnDestroy() {
    this.unbindEvents();
    this.remove();
  }

}

@Directive({
  // tslint:disable-next-line
  selector: '[cpValidate]',
  exportAs: 'customValidation',
})
export class ValidateDirective implements AfterContentInit {

  _rules: any;

  @Input()
  get rules(): any {
    return this._rules;
  }

  set rules(rules: any) {
    this._rules = rules;
  }

  fromEl: ElementRef;

  constructor(private el: ElementRef) {
    this.fromEl = el;
  }

  @ContentChildren(ValidDirective, {descendants: true})
  valids: QueryList<ValidDirective>;

  ngAfterContentInit() {
    this.rules = new Map(this.rules);
  }

  check() {
    let first: any;
    if (this.valids) {
      const valids = this.valids.toArray();
      let firstPosition: any;
      valids.forEach((x) => {
        const elPostion = x.getElPosition();
        x.check();
        if (!first && x.errorMsg) {
          first = x;
          firstPosition = elPostion;
        }
      });
      if (first) {
        const isscroll = firstPosition.y - (55 + 49) < 0;
        first.scroll(isscroll);
      }
    }
    return !first;
  }


  checkForOne(name: string) {
    if (name === null || name === '') {
      return;
    }
    const valid = this.valids.find(f => f.name === name);
    if (valid) {
      this.rules = new Map(this.rules);
      valid.rule = this.rules.get(name);
      valid.check();
      valid.onFocus('');
      if (valid.errorMsg !== '') {
        const elPostion = valid.getElPosition();
        const isscroll = elPostion.y - (55 + 49) < 0;
        valid.scroll(isscroll);
        return false;
      }
    }
    return true;
  }


  initValidForList(names: Array<string>) {
    if (names === null || names.length <= 0) {
      return;
    }
    const valids = this.valids.toArray();
    valids.forEach((x) => {
      names.forEach((y) => {
        if (x.name === y) {
          x.clear();
        }
      });
    });
  }

  initValid() {
    const valids = this.valids.toArray();
    valids.forEach((x) => {
      x.clear();
    });
  }

  getScrollTop = () => {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }
}
