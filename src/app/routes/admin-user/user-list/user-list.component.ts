/**
 *  ユーザー一覧
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, Injector, ViewChild, NgZone } from '@angular/core';
import { AbstractListComponent } from '../../../common/core-base/abstract/abstract.list.component';
import * as _ from 'lodash';
import { AdminUserService } from '../admin-user.service';
import { Role } from '../../../common/core-components/role.enum';
import { AuthInfoService } from '../../../common/core-services/auth-info.service';
import { Modal, MODAL_TYPE } from '../../../common/core-components/modals/modal.component';
import { I18NService } from '../../../common/core-services/i18n.service';
import { HelperService } from '../../../shared/helper.service';
import { GeneralDefinitionKey } from '../../../shared/constants';
import { UserInfoService } from '../../../common/core-services/user-info.service';
import { UserInfo } from '../admin-user.class';
import { ValidateDirective } from '../../../common/core-components/validate/validate.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends AbstractListComponent implements OnInit {

  // 権限
  role = Role;
  // フォームのデータ
  searchForm: any;
  // ユーザー一覧
  userList = [];
  // 全選択
  checkedAll = false;
  copyCheckedAll = false;
  // 全ての記録
  totalRecords: number;
  // ユーザー詳細
  userDetail: any;
  userInsEditModalVis = false;
  userDetailModalVis = false;
  mailInfoList = [];
  rowItemId: any;
  copySearchForm: any;
  hover: number;
  // メッセージの情報
  resources: any;
  isSearch: boolean;
  faceList: Array<any>;
  permissionList = [];
  copyPermissionList = [];
  initPermissionList = [];
  checkUserIdList = [];
  userId: string;
  mailList = [];
  detailUserId: string;
  initStage: number;

  @ViewChild('userSearchForm', { static: true }) userSearchForm: ValidateDirective;
  userSearchRules: any;

  /**test code */
  progress: number = 0;
  label: string;

  constructor(
    injector: Injector,
    public authInfoService: AuthInfoService,
    private adminService: AdminUserService,
    private translate: I18NService,
    public helperService: HelperService,
    public userInfoService: UserInfoService,
    private _ngZone: NgZone
  ) {
    super(injector, 'userList');
    this.translate.getResource('message').subscribe((res: any) => {
      this.resources = res;
    });
  }

  ngOnInit() {
    this.isPostSearch = false;
    this.userSearchRules = [
      ['name', { maxlength: [144, true], zenkakuhankakualphanumeric: true }]
    ];
    this.initStage = 0;
    this.allDatas = new Array<UserInfo>();
    this.isSearch = this.autoSearchWhenLoad;　// 検索したかどうか
    this.mailList = this.helperService.getDefinition(GeneralDefinitionKey.MAIL_INFO);　// メールアドレス(登録有無)
    this.faceList = this.helperService.getDefinition(GeneralDefinitionKey.PHOTO_INFO);　// 顔情報
    this.initPermissionList = this.helperService.getDefinition(GeneralDefinitionKey.DAP_USER_AUTHORITY);　// ユーザ権限
    // 筆頭契約者権限以外の場合、筆頭契約者権限は表示されません
    if (this.userInfoService.currPermission !== this.role.DAP_LEADCONTRACTOR) {
      this.initPermissionList = _.filter(this.initPermissionList, function (d) {
        return d['code'] !== Role.DAP_LEADCONTRACTOR;
      });
    }
    // 権限が選ばれなかった
    this.initPermissionList.forEach(x => {
      x['checked'] = false;
    });
    this.copyPermissionList = _.cloneDeep(this.initPermissionList);
    // 初期化
    this.initForm();
    this.copySearchForm = _.cloneDeep(this.searchForm);
    // 検索呼び出し
    this.initPage();
    this.afterViewInit();
  }

  setPermissionList(list) {
    let value = '';
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (this.userInfoService.currPermission === this.role.DAP_LEADCONTRACTOR) {
          value = value ? value + '/' + this.helperService.getDefinitionName(this.permissionList, list[i]) :
            this.helperService.getDefinitionName(this.permissionList, list[i]);
        } else {
          if (list[i] !== this.role.DAP_LEADCONTRACTOR) {
            value = value ? value + '/' + this.helperService.getDefinitionName(this.permissionList, list[i]) :
              this.helperService.getDefinitionName(this.permissionList, list[i]);
          }
        }
      }
    }
    return value;
  }


  initForm = () => {
    this.permissionList = _.cloneDeep(this.initPermissionList);
    this.searchForm = {
      userId: '',
      name: '',
      faceInfo: ''
    };
  }

  protected searchVaildate = () => {
    return this.userSearchForm.check();
  }

  protected searchBefore = () => {
    this.isSearch = true;
    this.checkUserIdList = [];
    this.checkedAll = false;
    this.copyCheckedAll = this.checkedAll;
    this.copySearchForm = _.cloneDeep(this.searchForm);
    this.copyPermissionList = _.cloneDeep(this.permissionList);
    const permission = _.filter(this.permissionList, { checked: true });
    const reqParams = new Map();
    if (permission && permission.length > 0) {
      reqParams.set('name', this.searchForm.name);
      reqParams.set('permission', _.map(permission, 'code'));
      reqParams.set('faceInfo', this.searchForm.faceInfo);
    } else {
      reqParams.set('name', this.searchForm.name);
      reqParams.set('faceInfo', this.searchForm.faceInfo);
    }
    return this.adminService.searchConditionApiOption('dap_adminUsers', null, null, reqParams);
  }

  protected request = (apiOpt) => {
    return this.adminService.getUserList(apiOpt);
  }

  protected searchAfter = (resp: any) => {
    this.isSearch = true;
    if (!_.isEmpty(resp) && resp['list']) {
      this.allDatas = _.sortBy(resp['list'], function (item) {
        return Number(item.userId);
      });
      this.totalRecords = resp.count;
      if (this.apiParams.reqParams.get('offset') !== resp.offset) {
        this.currentPage = resp.offset === 0 ? 1 : (resp.offset / this.itemPerPage) + 1;
        this.initPage(this.currentPage);
      }
      if (this.checkedAll) {
        this.allDatas.forEach(x => {
          x['checked'] = true;
        });
      } else if (this.checkUserIdList && this.checkUserIdList.length > 0) {
        this.allDatas.forEach(x => {
          if (this.checkUserIdList.indexOf(x.userId) >= 0) {
            x['checked'] = true;
          }
        });
      }
    } else {
      this.allDatas = [];
      this.totalRecords = 0;
    }
  }

  // 一括削除
  protected toDelete = ($event: any) => {
    let content = this.helperService.format(this.resources.I203030, [this.checkUserIdList.length.toString()]);
    if (_.indexOf(this.checkUserIdList, this.userInfoService.userInfo.userId) !== -1) {
      content = this.helperService.format(this.resources.I203010, [this.checkUserIdList.length.toString()]);
    }
    let body = {};
    if (this.checkedAll) {
      content = this.resources.I203020;
      const permission = _.filter(this.permissionList, { checked: true });
      body = {
        deleteAllFlag: true,
        deleteCondition: {
          name: this.searchForm.name,
          permission: permission ? _.map(permission, 'code') : undefined,
          faceInfo: this.searchForm.faceInfo
        }
      };
    } else {
      body = {
        deleteAllFlag: false,
        userIdList: this.checkUserIdList
      };
    }
    Modal({
      type: MODAL_TYPE.INFO,
      content: content,
      deleteText: this.resources.delete,
      cancelText: this.resources.cancel,
      ok: () => {
        this.adminService.userBatchDel(body).subscribe(resp => {
          Modal({
            type: MODAL_TYPE.INFO,
            content: this.resources.I000060,
            onHidden: () => {
              this.doSearch(true);
            }
          });
        }, err => { });
      },
      cancel: () => {
        return true;
      }
    });
  }

  toInsert = ($event: any) => {
    this.userInsEditModalVis = true;
  }

  protected handleError = (error: any) => {
  }

  // 検索条件が変化した場合は検索しない
  searchChange() {
    this.isSearch = this.conditionChange();
    //  検索条件が変わた場合、チェックを外し、Disableにする。
    if (this.copyCheckedAll && !this.isSearch) {
      this.checkedAll = false;
      this.allDatas.forEach(item => {
        item['checked'] = this.checkedAll;
      });
    }
  }

  conditionChange(): boolean {
    return _.isEqual(this.searchForm, this.copySearchForm) && _.isEqual(this.permissionList, this.copyPermissionList);
  }

  // クリア
  doClear = () => {
    this.initForm();
    this.searchChange(); // 検索条件が変化した場合は検索しない
    this.userSearchForm.initValid();
  }

  // ユーザー情報ダウンロード
  download = () => {
    let content = this.helperService.format(this.resources.I203010, [this.checkUserIdList.length.toString()]);
    let body = {};
    if (this.checkedAll) {
      content = this.resources.I203020;
      const permission = _.filter(this.permissionList, { checked: true });
      body = {
        name: this.searchForm.name,
        permission: permission ? _.map(permission, 'code') : undefined,
        faceInfo: this.searchForm.faceInfo
      };
    } else {
      body = {
        userIdList: this.checkUserIdList
      };
    }
    this.adminService.userDownload(body).subscribe(val => {
      if (val) {
        this.helperService.download(val.fileName, val.data);
      }
    }, err => { });
  }

  // 全選択
  checkAll = (value) => {
    this.checkedAll = value;
    if (!this.copyCheckedAll && this.checkedAll) {
      this.checkUserIdList = [];
    }
    this.allDatas.forEach(item => {
      item['checked'] = this.checkedAll;
    });
    this.copyCheckedAll = this.checkedAll;
  }

  onCheckboxClick(item) {
    this.checkedAll = false;
    this.copyCheckedAll = this.checkedAll;
    const index = this.checkUserIdList.indexOf(item.userId);
    if (index >= 0) {
      this.checkUserIdList.splice(index, 1);
    } else {
      this.checkUserIdList.push(item.userId);
    }
  }

  checkUserList() {
    return this.checkUserIdList.length === 0;
  }

  toggleHover = (isHover: number) => {
    this.hover = isHover;
  }

  // 個別詳細
  openUserDetail = (data) => {
    if (this.isSearch) {
      this.detailUserId = data['userId'];
      this.userDetailModalVis = true;
    }
  }

  // 個別詳細 close
  detailChange(event) {
    this.userDetailModalVis = false;
    this.detailUserId = '';
    if (event) {
      this.doSearch(false);
    }
  }

  // 作成
  insDataChange(event) {
    this.userInsEditModalVis = false;
    if (event.pModalRefresh) {
      this.doSearch(true);
    }
  }

  itemPerPageChange = (e) => {
    this.itemPerPage = e;
  }

  /**test code */
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        this._ngZone.run(() => {console.log('Outside Done!') });
    })});
  }
  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);

    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10)
    } else {
      doneCallback();
    }
  }
}
