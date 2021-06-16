/**
 *  個別詳細
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, Input, Output, EventEmitter, Injector, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AdminUserService } from '../../admin-user.service';
import { AbstractDeleteComponenet } from '../../../../common/core-base/abstract/abstract.delete.component';
import { Modal, MODAL_TYPE } from '../../../../common/core-components/modals/modal.component';
import { AuthInfoService } from '../../../../common/core-services/auth-info.service';
import { UserInfoService } from '../../../../common/core-services/user-info.service';
import { Role } from '../../../../common/core-components/role.enum';
import { Globals } from '../../../../common/global';
import { UserDetailInfo } from '../../admin-user.class';
import { I18NService } from '../../../../common/core-services/i18n.service';
import { HelperService } from '../../../../shared/helper.service';
import { GeneralDefinitionKey } from '../../../../shared/constants';
import { NavigationService } from '../../../../common/core-components/navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
  styleUrls: ['./user-detail-modal.component.css']
})
export class UserDetailModalComponent extends AbstractDeleteComponenet implements OnInit, OnDestroy {

  @Input() userId: any;
  @Input() visible: boolean;
  @Input() isHeaderMenuClick = false;
  @Output() detailChange: EventEmitter<any> = new EventEmitter();
  role = Role;

  data: UserDetailInfo;
  userEditModalVis = false;
  passwordChangeModalVis = false;
  userInsEditModalVis = false;
  ownUser = false;
  resources: any;
  isEdit = false;
  permissionList = [];
  notifySetting = [];
  faceList = [];

  routerSub: any;

  constructor(
    injector: Injector,
    public authInfoService: AuthInfoService,
    private adminService: AdminUserService,
    private userInfoService: UserInfoService,
    private globals: Globals,
    private translate: I18NService,
    public helperService: HelperService,
    private navigation: NavigationService,
    private router: Router
  ) {
    super(injector);
    this.translate.getResource('message').subscribe((res: any) => {
      this.resources = res;
    });
  }

  ngOnInit() {
    this.ownUser = this.userInfoService.userInfo.userId === this.userId;
    this.permissionList = this.helperService.getDefinition(GeneralDefinitionKey.DAP_USER_AUTHORITY);
    this.notifySetting = this.helperService.getDefinition(GeneralDefinitionKey.NOTIFY_SETTING);
    this.faceList = this.helperService.getDefinition(GeneralDefinitionKey.PHOTO_INFO); // 顔情報
    this.isEdit = false;
    this.init();
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  // 初期化
  init() {
    this.data = new UserDetailInfo();
    // override
    this.request = (apiOpt) => {
      return this.adminService.getUserDetail(apiOpt);
    };
    this.afterViewInit();
  }

  protected initBefore = () => {
    const body = {
      userId: this.userId
    };
    return this.adminService.searchConditionApiOption('dap_adminUserDetail', null, body, null);
  }

  protected initAfter = (data) => {
    this.data = data;
  }

  protected validate = () => {
    return true;
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
        if (val.indexOf('E9000005') >= 0) { // ユーザーの存在チェック
          if (this.isHeaderMenuClick) {
            // todo
          } else {
            // 遷移元がユーザー一覧画面の場合  ユーザー一覧画面 遷移
            this.isEdit = true;
            this.closeModal();
          }
        }
      }
    });
  }

  protected deleteBefore = () => {
    // override
    this.request = (apiOpt) => {
      return this.adminService.userDel(apiOpt);
    };
    const body = {
      userId: this.userId,
      lastUpdateTime: this.data.lastUpdateTime
    };
    return this.adminService.searchConditionApiOption('dap_adminUserDelete', null, body, null);
  }

  protected deleteAfter = (param) => {
    this.isEdit = true;
    this.closeModal();
  }

  protected deleteConfrimMsgPrepare = () => {
    return { content: this.resources.I204010 };
  }

  protected deleteCompleteMsgPrepare = () => {
    return { content: this.resources.I000060 };
  }

  closeModal = () => {
    this.visible = false;
    this.detailChange.emit(this.isEdit);
  }

  // 編集
  editClick() {
    this.userEditModalVis = true;
  }

  // 編集close
  editDataChange(event) {
    this.userEditModalVis = false;
    if (event.pModalRefresh && event.pModalClose) {
      this.isEdit = true;
      this.closeModal();
    } else if (event.pModalRefresh) {
      this.isEdit = true;
      this.init();
    } else if (event.pModalClose) {
      this.closeModal();
    }
  }

  // パスワードリセット
  passwordResetClick() {
    Modal({
      type: MODAL_TYPE.CONFIRM,
      content: this.resources.I112020,
      okText: this.resources.ok,
      cancelText: this.resources.no,
      cancelBtnClass: 'c-Btn__secondary c-Btn-lg marginL',
      ok: () => {
        this.passwordReset();
      },
      cancel: () => {
        return true;
      }
    });
  }

  passwordReset() {
    const body = {
      userId: this.userId
    };
    const apiOpt = this.adminService.searchConditionApiOption('dap_userPasswordReset', null, body, null);
    this.adminService.passwordReset(apiOpt).subscribe(rep => {
      if (rep) {
        Modal({
          type: MODAL_TYPE.INFO,
          content: this.helperService.format(this.resources.I112030, [rep.newPassword]),
          onHidden: () => {
            this.isEdit = true;
            this.init();
          }
        });
      }
    }, err => {
      this.globals.errorMessageSet.subscribe(val => {
        if (val) {
          // ユーザー一覧画面に遷移
          if (val.indexOf('E9000005') >= 0) {
            this.isEdit = true;
            this.closeModal();
          }
        }
      });
    });
  }

  // 権限種別
  setPermissionList(list) {
    const strList = _.cloneDeep(list);
    if (this.userInfoService.currPermission !== this.role.DAP_LEADCONTRACTOR) {
      _.remove(strList, n => {
        return n === this.role.DAP_LEADCONTRACTOR;
      });
    }
    let value = '';
    if (strList) {
      for (let i = 0; i < strList.length; i++) {
        value = value ? value + '/' + this.helperService.getDefinitionName(this.permissionList, strList[i]) :
          this.helperService.getDefinitionName(this.permissionList, strList[i]);
      }
    }
    return value;
  }

  // リンク
  moveClick(router: string) {
    const params = {
      userId: this.data.userId,
      userName: this.data.name
    };
    if (router === this.globals.currentActiveRoute) {
      this.helperService.emit(false);
    } else {
      this.helperService.emit(true);
    }
    this.closeModal();
    this.navigation.navigate(router, params);
  }
}
