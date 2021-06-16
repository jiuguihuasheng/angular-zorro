/**
 *  単項目チェック機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable, Input, Injector, Directive } from '@angular/core';
import * as _ from 'lodash';
import { VALID_MESSAGE } from '../core-components/validate/validMessage';

export const RULES = {
  // 必須チェック
  REQUIRED: 'required',
  // 英数字のみチェック
  ALPHANUMERIC: 'alphanumeric',
  // 半角英数記号
  ALPHANUMERICANDSYMBOLS: 'alphanumericAndSymbols',
  // 数字のみチェック
  NUMERIC: 'numeric',
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
};



@Directive()
@Injectable()
// tslint:disable-next-line:directive-class-suffix
export class ValidService {
  private rule;
  private errmsg: Array<string> = [];

  @Input()
  name: string;

  error = {
    [RULES.REQUIRED]: VALID_MESSAGE.E000010, // '必須入力項目です。',
    [RULES.ALPHANUMERIC]: VALID_MESSAGE.E000020, // '半角英数字で入力してください。',
    [RULES.NUMERIC]: VALID_MESSAGE.E000060, // '半角数字で入力してください。',
    [RULES.ALPHANUMERICANDSYMBOLS]: VALID_MESSAGE.E000050, // '半角英数字記号で入力してください。',
    [RULES.EMAIL]: '有効なメールアドレスではありません。',
    [RULES.TEL]: '有効な電話番号ではありません。',
    [RULES.URL]: 'URLリンクに入力されたURLは不正です。',
    [RULES.ZIPCODE]: '有効な郵便番号ではありません。',
    [RULES.MINLENGTH]: '{0}文字以上で入力してください。',
    [RULES.MAXLENGTH]: VALID_MESSAGE.E000070, // '{0}文字以内で入力して下さい。',
    [RULES.EQUALLENGTH]: '{0}桁入力してください。',
    [RULES.RANGE]: VALID_MESSAGE.E000080, // '{0}以上、{1}以内で入力してください。',
    [RULES.STEP]: '小数{0}桁数以内で入力してください。',
    [RULES.REGEX]: '正規表現データではありません。',
    [RULES.ZENKAKU]: '全角ではありません。',
    [RULES.ZENKAKUKANJI]: '日本語全角を入力してください', // (英数字は入力できません)
    [RULES.HIRAGANAALPHA]: '全角ひらがなまたは半角アルファベットを入力してください。',
    [RULES.ZENKAKUHIRAGA]: '全角カナを入力してください。',
    [RULES.HANKAKU]: '半角ではありません。',
    [RULES.KATAKANA]: 'カタカナではありません。',
    [RULES.ALPHANUMERICORZENKAKU]: '日本語なら全角、英数字記号なら半角で入力してください。',
    [RULES.FUNC]: '正しいデータを入力してください。',
    [RULES.PASSWORD]: '有効なパスワードではありません。',
    [RULES.USERID]: '有効なユーザーIDではありません。',
    [RULES.MONEY]: '数値のみで入力してください。',
    [RULES.NUMBERRANGE]: '{0}以上、{1}以内で入力してください。',
    [RULES.NUMERICORZENKAKU]: '日本語なら全角、数字なら半角で入力してください。',
    [RULES.HANKAKUKATAKANA]: '半角カタカナで入力してください。',
  };

  addErrMsg(msg: string) {
    this.errmsg.push(msg);
  }

  getErrMsg() {
    return this.errmsg[0] || '';
  }

  constructor(
    private inj: Injector) { }

  check(rule: any, value: any, emptyValue?: any): any {
    this.errmsg = [];

    if (rule) {
      const checkTypes = Object.keys(rule);
      checkTypes.forEach(type => {
        let ischeck = true;
        // tslint:disable-next-line
        let { err, condition } = this.analysisCondition(type, rule[type]);
        switch (type) {
          case RULES.REQUIRED:
            if (condition) {
              if (_.isArray(value) && value.length === 0) {
                ischeck = false;
                value.forEach(element => {
                  if (element.checked) {
                    ischeck = true;
                    return;
                  }
                });
              } else {
                ischeck = true;
                if (!value) {
                  ischeck = false;
                  break;
                }
                if (
                  (_.isObject(value) && _.isEmpty(value)) ||
                  (_.isArray(value) && value.length === 0) ||
                  (emptyValue && emptyValue === value)) {
                  ischeck = false;
                }
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
            if (value && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)

            ) {
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
            if (value && !/^[a-zA-Z0-9!"@\ \#\$\%\&\'\(\)\=\-\~\^\|\\\_\?\>\<\,\.\/]+$/.test(value)) {
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

    const errmsg = this.getErrMsg();
    return errmsg;
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
      case RULES.NUMERIC:
      case RULES.HANKAKU:
      case RULES.ZENKAKU:
      case RULES.HIRAGANAALPHA:
      case RULES.ZENKAKUKANJI:
      case RULES.KATAKANA:
      case RULES.HANKAKUKATAKANA:
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
        err = this.error[type];
        break;
    }

    if (!err) {
      err = this.prepareErrorMsg(type, condition);

    }
    return { err, condition };
  }

  private prepareErrorMsg(type: string, cond: any): string {
    let err = '';
    switch (type) {
      case RULES.MINLENGTH:
      case RULES.MAXLENGTH:
      case RULES.EQUALLENGTH:
        err = this.format(this.error[type], [cond]);
        break;
      case RULES.RANGE:
      case RULES.STEP:
      case RULES.NUMBERRANGE:
        const condition = cond;
        err = this.format(this.error[type], condition);
        break;
      default:
        err = this.error[type];
    }
    return err;
  }

  private format(str: string, replacements: Array<string>): string {
    return str.replace(/\{(\d+)\}/g, function () {
      return replacements[arguments[1]];
    });
  }

  checkBoxValidate(value1: any, value2: any): boolean {
    let ischeck1 = true;
    let ischeck2 = true;
    if (!value1 ||
      (_.isObject(value1) && _.isEmpty(value1)) ||
      (_.isArray(value1) && value1.length === 0)) {
      ischeck1 = false;
    }
    if (!value2 ||
      (_.isObject(value2) && _.isEmpty(value2)) ||
      (_.isArray(value2) && value2.length === 0)) {
      ischeck2 = false;
    }
    return ischeck1 || ischeck2;
  }

}
