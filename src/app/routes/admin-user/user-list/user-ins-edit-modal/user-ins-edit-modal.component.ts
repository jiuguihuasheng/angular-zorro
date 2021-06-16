/**
 *  アカウント情報を入力
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Injector } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AdminUserService } from '../../admin-user.service';
import { Modal, MODAL_TYPE } from '../../../../common/core-components/modals/modal.component';
import { ValidateDirective } from '../../../../common/core-components/validate/validate.component';
import { UserDetailInfo, SuddenOperationInfo, DangerousBehaviorInfo, DangerousDrivingInfo } from '../../admin-user.class';
import { I18NService } from '../../../../common/core-services/i18n.service';
import { AbstractEditComponenet } from '../../../../common/core-base/abstract/abstract.edit.component';
import { UserInfoService } from '../../../../common/core-services/user-info.service';
import { HelperService } from '../../../../shared/helper.service';
import { GeneralDefinitionKey, UniversalCode } from '../../../../shared/constants';
import { Observable } from 'rxjs';
import { NavigationService } from '../../../../common/core-components/navigation/navigation.service';
import { Globals } from '../../../../common/global';
import { environment } from '../../../../../environments/environment';
import { AuthInfoService } from '../../../../common/core-services/auth-info.service';
import { Role } from '../../../../common/core-components/role.enum';

@Component({
  selector: 'user-ins-edit-modal',
  templateUrl: './user-ins-edit-modal.component.html',
  styleUrls: ['./user-ins-edit-modal.component.css']
})
export class UserInsEditModalComponent extends AbstractEditComponenet implements OnInit {

  @Input() flag: string;
  @Input() userId: string;
  @Input() isHeaderMenuClick = false;
  @Output() insEditDataChange: EventEmitter<any> = new EventEmitter();
  @Input() visible: boolean;

  @ViewChild('userCreateEditForm') userCreateEditForm: ValidateDirective;

  copyData: UserDetailInfo;
  resources: any;
  faceInfoList = [];
  userCreateEditRules: any;
  data: UserDetailInfo;
  modalSet: any;
  universalCode = UniversalCode;
  permissionList = [];
  role = Role;
  constructor(
    injector: Injector,
    public authInfoService: AuthInfoService,
    private adminService: AdminUserService,
    public userInfoService: UserInfoService,
    public helperService: HelperService,
    private globals: Globals,
    private translate: I18NService,
    private navigation: NavigationService
  ) {
    super(injector);
    this.translate.getResource('message').subscribe((res: any) => {
      this.resources = res;
    });
  }

  ngOnInit() {
    this.userCreateEditRules = [
      ['userName', { required: true, zenkakuhankakualphanumeric: true, maxlength: [144, true] }],
      ['userEmail', { email: true, maxlength: [254, true] }],
      ['birthDate', { required: true }],
      ['authority', { required: true }],
      ['phone', { numeric: true, maxlength: [15, true] }],
    ];
    this.permissionList = this.helperService.getDefinition(GeneralDefinitionKey.DAP_USER_AUTHORITY); // ユーザ権限
    this.init();
  }

  birthDateChange = () => {
    this.userCreateEditForm.checkForOne('birthDate');
  }

  initNotifySetting() {
    this.data.accident = UniversalCode.notifySettingOff;
    this.data.parkingImpact = UniversalCode.notifySettingOff;
    this.data.deviceBreakdown = UniversalCode.notifySettingOff;
    this.data.suddenOperation = new SuddenOperationInfo(UniversalCode.notifySettingOff);
    this.data.dangerousBehavior = new DangerousBehaviorInfo(UniversalCode.notifySettingOff);
    this.data.dangerousDriving = new DangerousDrivingInfo(UniversalCode.notifySettingOff);
  }

  init() {
    this.data = new UserDetailInfo();
    this.modalSet = { pModalRefresh: false, pModalClose: false };
    // override
    this.request = (apiOpt) => {
      return this.adminService.getUserDetail(apiOpt);
    };
    if (this.flag === 'edit') {
      this.afterViewInit();
    } else {
      this.initNotifySetting();
    }
  }

  protected initBefore = () => {
    const body = {
      userId: this.userId
    };
    return this.adminService.searchConditionApiOption('dap_adminUserDetail', null, body, null);
  }

  protected initAfter = (data) => {
    if (data['birthDate']) {
      data['birthDate'] = moment(data['birthDate'], 'YYYYMMDD').format('YYYY/MM/DD');
    }
    this.data = data;
    this.copyData = _.cloneDeep(data);
    this.permissionList.forEach(x => {
      if (this.data.permission && this.data.permission.indexOf(x.code) >= 0) {
        x['checked'] = true;
      }
    });
  }

  protected validate = () => {
    return this.userCreateEditForm.check();
  }

  protected request = (param: any) => {
    return new Observable(observer => {
      observer.next('');
      observer.complete();
    });
  }

  protected handleError = (error) => {
    this.globals.errorMessageSet.subscribe(val => {
      if (val) {
        if (val.indexOf('E9000005') >= 0) { // ユーザー存在チェック
          if (this.isHeaderMenuClick) {
            // 遷移元がマイアカウントメニューの場合  ログアウトして、ログインイン画面 遷移
            if (environment.testFlag === 'NO_AUTH') {
              this.modalSet = { pModalRefresh: false, pModalClose: true };
              this.closeModal();
              this.navigation.navigate('/login');
            }
          } else {
            // 遷移元がユーザー一覧画面の場合  ユーザー一覧画面 遷移
            this.modalSet = { pModalRefresh: true, pModalClose: true };
            this.closeModal();
          }
        }
      }
    });
  }

  protected editBefore = () => {
    if (this.flag === 'edit') {
      // override
      this.request = (param) => {
        return this.adminService.userEdit(param);
      };
      const permission = _.filter(this.permissionList, { checked: true });
      this.data.permission = _.map(permission, 'code');
      const body = _.omit(this.data, ['faceInfoRegistStatus']);
      body['userId'] = this.userId;
      return this.adminService.searchConditionApiOption('dap_adminUserUpdate', null, body);
    } else {
      // override
      this.request = (param) => {
        return this.adminService.userCreate(param);
      };
      const permission = _.filter(this.permissionList, { checked: true });
      this.data.permission = _.map(permission, 'code');
      const body = _.omit(this.data, ['lastUpdateTime', 'userId', 'faceInfoRegistStatus']);
      return this.adminService.searchConditionApiOption('dap_adminUserIns', null, body);
    }
  }


  protected editAfter = (data: any) => {
    this.modalSet = { pModalRefresh: true, pModalClose: false };
    this.closeModal();
  }

  // 編集/登録の場合
  protected editCompleteMsgPrepare = () => {
    return;
  }

  showEditCompleteModal = (resp) => {
    if (this.flag === 'edit') {
      if (resp.password) {
        Modal({
          type: MODAL_TYPE.INFO,
          content: this.helperService.format(this.resources.I207010, [resp.password]),
          onHidden: () => {
            this.editAfter(resp);
          }
        });
      } else {
        Modal({
          type: MODAL_TYPE.INFO,
          content: this.resources.I000070,
          onHidden: () => {
            this.editAfter(resp);
          }
        });
      }
    } else {
      Modal({
        type: MODAL_TYPE.INFO,
        content: this.helperService.format(this.resources.I209010, [resp ? resp.password : '']),
        onHidden: () => {
          this.editAfter(resp);
        }
      });
    }
  }

  // アカウント情報を入力 close
  closeModal() {
    this.visible = false;
    this.insEditDataChange.emit(this.modalSet);
  }

  // 権限種別 check
  checkboxChange() {
    const permission = _.filter(this.permissionList, { checked: true });
    this.data.permission = _.map(permission, 'code');
  }

  // 保存 disabled
  isValidUpd() {
    return _.isEqual(this.data, this.copyData);
  }
}
