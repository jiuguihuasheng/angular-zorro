/**
 *  常量
 *  @version 1.0
 *  @author
 */
export const GeneralDefinitionKey = {
  DA_USER_AUTHORITY: 'DA_USER_AUTHORITY', // ユーザ権限(DA)
  DAP_USER_AUTHORITY: 'DAP_USER_AUTHORITY', //  ユーザ権限(DAP)
  DEVICE_STATUS: 'DEVICE_STATUS', //  端末状態
  DEVICE_SET_STATUS: 'DEVICE_SET_STATUS', // 端末設定状態
  PHOTO_INFO: 'PHOTO_INFO', // 顔情報
  ROBBERY_MODE: 'ROBBERY_MODE', // 盗難モード
  MAIL_INFO: 'MAIL_INFO', // メールアドレス(登録有無)
  NOTIFY_SETTING: 'NOTIFY_SETTING', // 通知設定
  DEVICE_SETTING: 'DEVICE_SETTING', // 端末設定
  DEVICE_LANUAGE: 'DEVICE_LANUAGE', // 言語
  VEHICLE_STATUS: 'VEHICLE_STATUS', // 車両状態
  PLAYBACK_CATEGORY: 'PLAYBACK_CATEGORY', // 再生区分

  DEVICE_SYSTEM_VOLUME: 'DEVICE_SYSTEM_VOLUME', // システム音量設定
  DEVICE_DISPLAY_MONITOR_BRIGHTNESS: 'DEVICE_DISPLAY_MONITOR_BRIGHTNESS', // 画面輝度設定
  DEVICE_MONITOR_TIME: 'DEVICE_MONITOR_TIME', // モニター表示設定
  DEVICE_CAMERA_EXPOSURE: 'DEVICE_CAMERA_EXPOSURE', // 露出補正
  DEVICE_CAMERA_SELECT: 'DEVICE_CAMERA_SELECT', // カメラ選択
  DEVICE_RECORD_MODE: 'DEVICE_RECORD_MODE', // 録画モード切替
  EVALUATION_EVENT_CATEGORY: 'EVALUATION_EVENT_CATEGORY', // イベント種別(P01-tab)
  EVENT_TYPE: 'EVENT_TYPE', // イベント種別
  DETECTION_TYPE: 'DETECTION_TYPE', // 検知種別
  ACCIDENT_REPORT_TYPE: 'ACCIDENT_REPORT_TYPE', // 発報種別
  DATA_DISTRIBUTION: 'DATA_DISTRIBUTION', // データ振り分け
  VEHICLE_TYPE: 'VEHICLE_TYPE', // 用途車種
  HVEV_TYPE: 'HVEV_TYPE', // HV/EV区分
  CATECGORY_TYPE: 'CATECGORY_TYPE', // debug
};

// 汎用定義CODE
export const UniversalCode = {
  notifySettingOn: '01', // 通知設定 ON
  notifySettingOff: '02', // 通知設定 OFF
  eventTypeImpactLg: '01', // 衝撃検知(大)
  eventTypeImpactMdSm: '02', // 衝撃検知(中＋小)
  eventTypeImpactMd: '03', // 衝撃検知(中)
  eventTypeImpactSm: '04', // 衝撃検知(小)
  eventTypeReport: '05', // 強制発報
  eventTypeSuddenAcceleration: '06', // 急操作(急アクセル)
  eventTypeSuddenBraking: '07', // 急操作(急ブレーキ)
  eventTypeSuddenHandle: '08', // 急操作(急ハンドル)
  eventTypeAsideLong: '09', // 危険検知(わき見長)
  eventTypeAsideShort: '10', // 危険検知(わき見短)
  eventTypeSideTracking: '11', // 危険検知(片寄り走行)
  eventTypeApproachingAheadVeryShort: '12', // 危険検知(前方車両接近極短)
  eventTypeApproachingAheadShort: '13', // 危険検知(前方車両接近短)
  detectionTypeImpactLg: '01', // 衝撃検知(大)
  detectionTypeImpactMdSm: '02', // 中小衝撃連続検知
  detectionTypeImpactMd: '03', // 衝撃検知(中)
  detectionTypeImpactSm: '04', // 衝撃検知(小)
  detectionTypeReport: '05', // 強制発報
  detectionTypeSuddenAcceleration: '06', // 危険挙動(急アクセル)
  detectionTypeSuddenBraking: '07', // 危険挙動(急ブレーキ)
  detectionTypeSuddenHandle: '08', // 危険挙動(急ハンドル)
  detectionTypeApproachSuddenAcceleration: '09', // 前方車両接近極端+急アクセル
  detectionTypeApproachSuddenBraking: '10', // 前方車両接近極端+急ブレーキ
  detectionTypeApproachSuddenHandle: '11', // 前方車両接近極端+急ハンドル
  detectionTypeApproachShort: '12', // 前方車両接近短
  detectionTypeAsideLong: '13', // わき見長
  detectionTypeAsideShort: '14', // わき見短
  detectionTypeSideTracking: '15', // 片寄り走行
  detectionTypeImpactParking: '16', // 駐車中衝撃
  reportTypeOrganization: '01', // 組織別 レポート種別
  reportTypeDriver: '02', // ドライバー別 レポート種別
  reportTypeContract: '03', // 契約別 レポート種別
  dataDistributionNot: '01', // データ振り分け 未
  dataDistributionHave: '02', // データ振り分け 済
  oneWeek: '01', // 1週間
  eightWeek: '02', // 8週間
  sixMonth: '03', // 6ヵ月
  totality: '01', // 全体
  suddenOperation: '02', // 急操作
  dangerousDriving: '03', // 危険運転
  dangerousBehavior: '04', // 危険挙動
  accidents: '05', // 事故
  deviceSetting: '01', // 変更中
};
