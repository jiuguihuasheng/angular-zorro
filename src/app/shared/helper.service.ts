/**
 *  共通の方法 汎用定義
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { GeneralDefinitionKey, UniversalCode } from './constants';
import { Modal, MODAL_TYPE } from '../common/core-components/modals/modal.component';
import { Role } from '../common/core-components/role.enum';
import { Subject } from 'rxjs';

@Injectable()
export class HelperService {

  reload: boolean;

  constructor(
  ) { }

  private subject = new Subject<boolean>();

  ob = this.subject.asObservable();

  emit(reload: boolean) {
    this.reload = reload;
    this.subject.next(reload);
  }

  // Get Monday and Sunday dates of the week
  getCurrentWeek(format: string) {
    const start = moment().weekday(1).format(format); // Monday
    const end = moment().weekday(7).format(format); // Sunday
    return [start, end];
  }

  // Gets the Monday and Sunday dates of the next i-week and returns them as an array.
  getNextWeek(i: number, format: string) {
    const weekOfDay = Number(moment().format('E')); // Calculate what day of the week it is today
    const next_monday = moment().add((7 - weekOfDay) + 7 * (i - 1) + 1, 'days').format(format); // Monday date
    const next_sunday = moment().add((7 - weekOfDay) + 7 * i, 'days').format(format); // Sunday date
    return [next_monday, next_sunday];
  }

  // current date
  getCurrentDate(format: string) {
    return moment().format(format);
  }

  // next date type: months/years/days
  getNextDate(i: any, type: any, format: string) {
    return moment().add(i, type).format(format);
  }

  definitionList() {
    const infoMap = {};
    infoMap[GeneralDefinitionKey.DAP_USER_AUTHORITY] = [ // ユーザ権限(DAP)
      {
        code: Role.DAP_LEADCONTRACTOR,
        name: '筆頭契約者'
      },
      {
        code: Role.DAP_FAMILYDRIVER,
        name: '家族ドライバー'
      },
      {
        code: Role.DAP_WATCHER,
        name: '見守り者'
      },
      // {
      //   code: Role.DAP_OPERATION,
      //   name: '運行データ閱覽権限'
      // }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_STATUS] = [ // 端末状態
      {
        code: '00',
        name: '故障（端末検知 / クラウド検知）'
      },
      {
        code: '01',
        name: '正常'
      }
    ];
    infoMap[GeneralDefinitionKey.PHOTO_INFO] = [ // 顔情報
      {
        code: '01',
        name: '登録済み'
      },
      {
        code: '02',
        name: '未登録'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_SET_STATUS] = [ // 端末設定状態
      {
        code: UniversalCode.deviceSetting,
        name: '変更中'
      },
      {
        code: '02',
        name: 'ー'
      },
      {
        code: '03',
        name: '失敗'
      },
      {
        code: '04',
        name: 'マージ'
      }
    ];
    infoMap[GeneralDefinitionKey.ROBBERY_MODE] = [ // 盗難モード
      {
        code: '01',
        name: '未設定'
      },
      {
        code: '02',
        name: '変更中'
      },
      {
        code: '03',
        name: '設定済'
      },
      {
        code: '04',
        name: '解除中'
      }
    ];
    infoMap[GeneralDefinitionKey.MAIL_INFO] = [ // メールアドレス有無
      { code: '01', name: '登録済み' }, { code: '02', name: '未登録' }
    ];
    infoMap[GeneralDefinitionKey.NOTIFY_SETTING] = [ // 通知設定
      { code: UniversalCode.notifySettingOn, name: 'ON' }, { code: UniversalCode.notifySettingOff, name: 'OFF' }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_SETTING] = [ // 端末設定
      {
        code: '00',
        name: 'OFF'
      },
      {
        code: '01',
        name: 'ON'
      },
      {
        code: '02',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_LANUAGE] = [ // 言語
      {
        code: '00',
        name: '日本語'
      },
      {
        code: '01',
        name: '英語'
      },
      {
        code: '02',
        name: '中国語（繁字）'
      },
      {
        code: '03',
        name: '中国語（簡字）'
      },
      {
        code: '04',
        name: '韓国語'
      },
      {
        code: '05',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.VEHICLE_STATUS] = [ // 車両状態
      {
        code: '00',
        name: '正常'
      },
      {
        code: '01',
        name: '故障'
      },
      {
        code: '02',
        name: '未検知'
      },
      {
        code: '03',
        name: '未検知(前回正常)'
      },
      {
        code: '04',
        name: '未検知(前回故障)'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_SYSTEM_VOLUME] = [ // システム音量設定
      {
        code: '00',
        name: '0'
      },
      {
        code: '01',
        name: '1'
      },
      {
        code: '02',
        name: '2'
      },
      {
        code: '03',
        name: '3'
      },
      {
        code: '04',
        name: '4'
      },
      {
        code: '05',
        name: '5'
      },
      {
        code: '06',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_DISPLAY_MONITOR_BRIGHTNESS] = [ // 画面輝度設定
      {
        code: '01',
        name: '1'
      },
      {
        code: '02',
        name: '2'
      },
      {
        code: '03',
        name: '3'
      },
      {
        code: '04',
        name: '4'
      },
      {
        code: '05',
        name: '5'
      },
      {
        code: '06',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_MONITOR_TIME] = [ // モニター表示設定
      {
        code: '00',
        name: '10秒'
      },
      {
        code: '01',
        name: '1分'
      },
      {
        code: '02',
        name: '3分'
      },
      {
        code: '03',
        name: '走行連動'
      },
      {
        code: '04',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_CAMERA_EXPOSURE] = [ // 露出補正
      {
        code: '00',
        name: '-1.0'
      },
      {
        code: '01',
        name: '-0.7'
      },
      {
        code: '02',
        name: '-0.3'
      },
      {
        code: '03',
        name: '0'
      },
      {
        code: '04',
        name: '+0.3'
      },
      {
        code: '05',
        name: '+0.7'
      },
      {
        code: '06',
        name: '+1.0'
      },
      {
        code: '07',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_CAMERA_SELECT] = [ // カメラ選択
      {
        code: '00',
        name: '1カメラ(前方のみ)'
      },
      {
        code: '01',
        name: '2カメラ(前方+車内)'
      },
      {
        code: '02',
        name: '2カメラ(前方+後方)'
      },
      {
        code: '03',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.DEVICE_RECORD_MODE] = [ // 録画モード切替
      {
        code: '00',
        name: '高品質'
      },
      {
        code: '01',
        name: '長時間'
      },
      {
        code: '02',
        name: '変更しない'
      }
    ];
    infoMap[GeneralDefinitionKey.EVENT_TYPE] = [ // イベント種別
      {
        code: UniversalCode.eventTypeImpactLg,
        name: '衝撃検知(大)'
      },
      {
        code: UniversalCode.eventTypeImpactMdSm,
        name: '衝撃検知(中＋小)'
      },
      {
        code: UniversalCode.eventTypeImpactMd,
        name: '衝撃検知(中)'
      },
      {
        code: UniversalCode.eventTypeImpactSm,
        name: '衝撃検知(小)'
      },
      {
        code: UniversalCode.eventTypeReport,
        name: '強制発報'
      },
      {
        code: UniversalCode.eventTypeSuddenAcceleration,
        name: '急操作(急アクセル)'
      },
      {
        code: UniversalCode.eventTypeSuddenBraking,
        name: '急操作(急ブレーキ)'
      },
      {
        code: UniversalCode.eventTypeSuddenHandle,
        name: '急操作(急ハンドル)'
      },
      {
        code: UniversalCode.eventTypeAsideLong,
        name: '危険検知(わき見長)'
      },
      {
        code: UniversalCode.eventTypeAsideShort,
        name: '危険検知(わき見短)'
      },
      {
        code: UniversalCode.eventTypeSideTracking,
        name: '危険検知(片寄り走行)'
      },
      {
        code: UniversalCode.eventTypeApproachingAheadVeryShort,
        name: '危険検知(前方車両接近極短)'
      },
      {
        code: UniversalCode.eventTypeApproachingAheadShort,
        name: '危険検知(前方車両接近短)'
      }
    ];
    infoMap[GeneralDefinitionKey.DETECTION_TYPE] = [ // 検知種別
      {
        code: UniversalCode.detectionTypeImpactLg,
        name: '衝撃検知(大)'
      },
      {
        code: UniversalCode.detectionTypeImpactMdSm,
        name: '中小衝撃連続検知'
      },
      {
        code: UniversalCode.detectionTypeImpactMd,
        name: '衝撃検知(中)'
      },
      {
        code: UniversalCode.detectionTypeImpactSm,
        name: '衝撃検知(小)'
      },
      {
        code: UniversalCode.detectionTypeReport,
        name: '強制発報'
      },
      {
        code: UniversalCode.detectionTypeSuddenAcceleration,
        name: '危険挙動(急アクセル)'
      },
      {
        code: UniversalCode.detectionTypeSuddenBraking,
        name: '危険挙動(急ブレーキ)'
      },
      {
        code: UniversalCode.detectionTypeSuddenHandle,
        name: '危険挙動(急ハンドル)'
      },
      {
        code: UniversalCode.detectionTypeApproachSuddenAcceleration,
        name: '前方車両接近極端+急アクセル'
      },
      {
        code: UniversalCode.detectionTypeApproachSuddenBraking,
        name: '前方車両接近極端+急ブレーキ'
      },
      {
        code: UniversalCode.detectionTypeApproachSuddenHandle,
        name: '前方車両接近極端+急ハンドル'
      },
      {
        code: UniversalCode.detectionTypeApproachShort,
        name: '前方車両接近短'
      },
      {
        code: UniversalCode.detectionTypeAsideLong,
        name: 'わき見長'
      },
      {
        code: UniversalCode.detectionTypeAsideShort,
        name: 'わき見短'
      },
      {
        code: UniversalCode.detectionTypeSideTracking,
        name: '片寄り走行'
      },
      {
        code: UniversalCode.detectionTypeImpactParking,
        name: '駐車中衝撃'
      }
    ];
    infoMap[GeneralDefinitionKey.ACCIDENT_REPORT_TYPE] = [ // 発報種別
      {
        code: '01',
        name: '自動発報'
      },
      {
        code: '02',
        name: '手動発報'
      },
      {
        code: '03',
        name: '発報無し'
      },
      {
        code: '04',
        name: 'PCアプリ'
      },
      {
        code: '05',
        name: '強制発報'
      },
      {
        code: '06',
        name: '手動保守点検'
      },
      {
        code: '07',
        name: '発報キャンセル（キャンセルボタン押下）'
      },
      {
        code: '08',
        name: '発報キャンセル（200m走行）'
      },
      {
        code: '09',
        name: '発報キャンセル（タイムアウト120s）'
      }
    ];
    infoMap[GeneralDefinitionKey.DATA_DISTRIBUTION] = [ // データ振り分け
      { code: UniversalCode.dataDistributionNot, name: '未' },
      { code: UniversalCode.dataDistributionHave,  name: '済' },
    ];
    infoMap[GeneralDefinitionKey.VEHICLE_TYPE] = [ // 用途車種
      {
        code: '01',
        name: '普通乗用車'
      },
      {
        code: '02',
        name: '小型乗用車'
      },
      {
        code: '03',
        name: '軽四輪乗用車'
      },
      {
        code: '04',
        name: '軽四輪貨物車'
      },
      {
        code: '05',
        name: '普通貨物車（２トン以下）'
      },
      {
        code: '06',
        name: '普通貨物車（２トン超）'
      },
      {
        code: '07',
        name: '普通貨物車（７トン以上）'
      },
      {
        code: '08',
        name: '小型貨物車'
      },
      {
        code: '09',
        name: 'バス（普通）'
      },
      {
        code: '10',
        name: 'バス（小型）'
      },
      {
        code: '11',
        name: '普通型ダンプカー（２トン以下）'
      },
      {
        code: '12',
        name: '普通型ダンプカー（２トン超）'
      },
      {
        code: '13',
        name: '小型ダンプカー'
      },
      {
        code: '14',
        name: '特種用途自動車（キャンピング車）'
      },
      {
        code: '15',
        name: '特種用途自動車（その他）'
      },
      {
        code: '16',
        name: 'Ａ種工作車（クレーン・ショベル）'
      },
      {
        code: '17',
        name: 'Ａ種工作車（その他）'
      },
      {
        code: '18',
        name: 'Ｂ種工作車'
      },
      {
        code: '19',
        name: 'その他１'
      },
      {
        code: '20',
        name: 'その他２'
      }
    ];
    infoMap[GeneralDefinitionKey.HVEV_TYPE] = [ // HV/EV区分
      {
        code: '00',
        name: 'それ以外'
      },
      {
        code: '01',
        name: 'HV/EV'
      }
    ];
    infoMap[GeneralDefinitionKey.EVALUATION_EVENT_CATEGORY] = [ // イベント種別(P01-tab)
      {
        code: UniversalCode.totality,
        category: 'totality',
        name: '全体'
      },
      {
        code: UniversalCode.suddenOperation,
        category: 'suddenOperation',
        name: '急操作'
      },
      {
        code: UniversalCode.dangerousDriving,
        category: 'dangerousDriving',
        name: '危険運転'
      },
      {
        code: UniversalCode.dangerousBehavior,
        category: 'dangerousBehavior',
        name: '危険挙動'
      },
      {
        code: UniversalCode.accidents,
        category: 'accidents',
        name: '事故'
      }
    ];
    infoMap[GeneralDefinitionKey.CATECGORY_TYPE] = [
      {
        code: '01',
        name: 'メンテナンス'
      },
      {
        code: '02',
        name: '停止中'
      },
      {
        code: '03',
        name: 'その他'
      }
    ];
    return infoMap;
  }

  getDefinition(key: any) {
    const generalDefinition = this.definitionList();
    return generalDefinition[key];
  }

  getDefinitionName(definitions: Array<any>, code: any) {
    if (!definitions) {
      return code || '';
    }
    if (!code) {
      return '';
    }
    const definition = _.find(definitions, { code: code });
    return definition ? definition.name : code;
  }

  getDefinitionValue(key: any, code: any) {
    if (!key) {
      return code || '';
    }

    if (!code) {
      return '';
    }

    const definitions = this.getDefinition(key);
    const definition = _.find(definitions, { code: code });
    return definition ? definition.name : code;
  }

  getEvaluationImgName(imageNo: any) {
    // 安全診断画像
    const images = [
      // 番号     画像名
      {no: '1', name: 'evaluation_image_41.png'},
      {no: '2', name: 'evaluation_image_34.png'},
      {no: '3', name: 'evaluation_image_32.png'},
      {no: '4', name: 'evaluation_image_3.png'},
      {no: '5', name: 'evaluation_image_39.png'},
      {no: '6', name: 'evaluation_image_37.png'},
      {no: '7', name: 'evaluation_image_41.png'},
      {no: '8', name: 'evaluation_image_36.png'},
      {no: '9', name: 'evaluation_image_35.png'}
    ];
    if (!imageNo) {
      return '';
    }
    const image = _.find(images, { no: imageNo.toString() });
    return image ? image['name'] : '';
  }

  format(str: string, replacements: Array<string>): string {
    return str.replace(/\{(\d+)\}/g, function () {
      return replacements[arguments[1]];
    });
  }

  download(fileName: string, blob: Blob) {
    if (!blob) {
      return;
    }
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.style.display = 'none';
      a.innerHTML = 'downloading';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // テンプレート
  fileValidate(messageFile: string, messageSize: string, file: File, accept: string, maxFileSize: any): boolean {
    if (!this.isFileTypeValid(file, accept)) {
      Modal({
        type: MODAL_TYPE.ERROR,
        // ファイルを選択してください
        content: messageFile
      });
      return false;
    }
    const fileSize = file.size / 1024 / 1024;
    if (maxFileSize && fileSize > maxFileSize) {
      Modal({
        type: MODAL_TYPE.ERROR,
        // `ファイルは「{0}M」を超えることはできません.
        content: this.format(messageSize, [maxFileSize.toString()])
      });
      return false;
    }
    return true;
  }

  private isFileTypeValid(file: File, accept: any): boolean {
    const _type = _.toLower(accept);
    const _file = _.toLower(this.getFileExtension(file));
    const acceptable = _type.indexOf(_file);
    if (acceptable >= 0) {
      return true;
    }
    return false;
  }

  private getFileExtension(file: File): string {
    return '.' + file.name.split('.').pop();
  }

  dateRangeCheck = (startDate, endDate) => {
    if (startDate && endDate) {
      if (moment(endDate, 'YYYY/MM/DD').isSame(moment(startDate, 'YYYY/MM/DD'))) {
        return true;
      } else {
        return moment(endDate, 'YYYY/MM/DD').isAfter(moment(startDate, 'YYYY/MM/DD'));
      }
    } else if (startDate || endDate) {
      return true;
    }
    return true;
  }

  formatDate(date: string, format?: string) {
    if (!date) {
      return '';
    }
    format = format ? format : 'YYYY/MM/DD';
    const value = moment(date, format);
    if (value.isValid()) {
      return value.format(format);
    }
  }

  // 秒を時間、分、秒の形式に変換します
  formatSeconds = (value) => {
    let theTime = _.parseInt(value);
    let minutes = 0;
    let hours = 0;

    if (theTime >= 60) {
      minutes = _.toInteger(theTime / 60);
      theTime = _.toInteger(theTime % 60);
      if (minutes >= 60) {
        hours = _.toInteger(minutes / 60);
        minutes = _.toInteger(minutes % 60);
      }
    }
    const time = {
      hours: hours.toString(),
      minutes: ('0' + minutes).slice(-2),
      seconds: ('0' + theTime).slice(-2)
    };
    if (hours <= 9) {
      time.hours = ('0' + hours).slice(-2);
    }
    return time;
  }

  // meter -> kilometer
  toKilometer = (meter: string) => {
    const num = _.toNumber(meter);
    if (!_.isNaN(num)) {
      const km = (num / 1000).toFixed(1).toString();
      return km;
    }
  }

}
