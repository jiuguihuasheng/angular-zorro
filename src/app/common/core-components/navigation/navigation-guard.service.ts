/**
 *  画面処理へのアクセス権限があるかどうか
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';
import { NavigationStatusService } from './navigation-status.service';
import { NavigationService } from './navigation.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Role } from '../role.enum';
import { UserInfoService } from '../../core-services/user-info.service';
import * as _ from 'lodash';
import { Globals } from '../../global';
import { Modal, MODAL_TYPE } from '../modals/modal.component';
import { RestApiService } from '../../core-services/rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationGuardService {
  roleMap = {
    [Role.DAP_LEADCONTRACTOR]: ['/admin/user/user-list'],
    [Role.DAP_FAMILYDRIVER]: ['/admin/user/user-list'],
    [Role.DAP_WATCHER]: ['/admin/user/user-list']
  };

  I000100 = 'アクセス権限がないため、ログアウトします。';

  constructor(private userInfoService: UserInfoService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentPermission = sessionStorage.getItem('currentPermission');
    console.log(state.url);
    // 画面権限認証
    if (this.roleMap[currentPermission] && _.indexOf(this.roleMap[currentPermission], state.url) !== -1) {
      return true;
    }
    if (this.userInfoService.currPermission) {
      Modal({
        type: MODAL_TYPE.INFO,
        textAlign: 'center',
        content: this.I000100,
        onHidden: () => {
          // todo
        }
      });
    }
    return false;
  }

}
