
/**
 * ユーザー機能のクラス
 *  @version 1.0
 *  @author
 */
// ユーザー情報検索
export class UserInfo {
  userId: string;
  name: string;
  permission: string;
  faceInfoRegistStatus: string; // 顔識別情報登録状況;
  phone: string;
  mailStatus: string; // メールアドレス有無
}

// 急操作
export class SuddenOperationInfo {
  suddenAcceleration: string; // 急アクセル;
  suddenBraking: string; // 急ブレーキ;
  suddenHandle: string; // 急ハンドル;
  constructor(code?: string) {
    if (code) {
      this.suddenAcceleration = code;
      this.suddenBraking = code;
      this.suddenHandle = code;
    }
  }
}

// 危険挙動
export class DangerousBehaviorInfo {
  aside: string; // わき見;
  constructor(code?: string) {
    if (code) {
      this.aside = code;
    }
  }
}

// 危険運転
export class DangerousDrivingInfo {
  sideTracking: string; // 片寄り走行;
  approachingAhead: string; // 前方車両接近;
  constructor(code?: string) {
    if (code) {
      this.sideTracking = code;
      this.approachingAhead = code;
    }
  }
}

export class UserDetailInfo {
  userId: string; // アカウントID;
  name: string; // 氏名;
  permission: Array<string>; // 権限種別  例：['01','04'];
  faceInfoRegistStatus: string; // 顔識別情報登録状況;
  phone: string; // 電話番号;
  birthDate: string; // 生年月日;
  mail: string; // メール状況
  lastUpdateTime: string; // 最後更新日時;
  accident: string; // 事故発報;
  suddenOperation: SuddenOperationInfo; // 急操作;
  dangerousBehavior: DangerousBehaviorInfo; // 危険挙動;
  dangerousDriving: DangerousDrivingInfo; // 危険運転;
  parkingImpact: string; // 駐車中衝撃検知;
  deviceBreakdown: string; // 端末故障検知;
  constructor() {
    this.suddenOperation = new SuddenOperationInfo();
    this.dangerousBehavior = new DangerousBehaviorInfo();
    this.dangerousDriving = new DangerousDrivingInfo();
  }
}
