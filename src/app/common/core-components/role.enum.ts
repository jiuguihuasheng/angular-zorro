export enum Role {
  // DA
  DA_SYSTEM = '01', // 企業システム管理者
  DA_ORGANIZATIONADMIN = '02', // 組織管理者
  DA_ORGANIZATIONDRIVER = '03', // 組織ドライバー
  DA_WATCHER = '04', // 見守り者
  // DAP
  DAP_LEADCONTRACTOR = '05', // 筆頭契約者
  DAP_FAMILYDRIVER = '06', // 家族ドライバー
  DAP_WATCHER = '07', // 見守り者
  // DAP_OPERATION = '04', // 運行データ閲覧権限
  // TMNF
  TMNF_SYSTEMMANAGEMENT = '01', // TMNFシステム管理者
  TMNF_COMPANYSETTING = '02', // TMNF企業・端末管理者
  TMNF_ACCIDENTVIEW = '03', // TMNF事故情報閲覧者
  TMNF_AGENCY = '04', // TMNF代理店
}
