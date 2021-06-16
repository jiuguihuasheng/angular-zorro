/**
 *  画面ヘッド
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { UserInfoService } from '../../common/core-services/user-info.service';
import { Globals } from '../../common/global';
import { Role } from '../../common/core-components/role.enum';
import { AuthInfoService } from '../../common/core-services/auth-info.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() menuRight = false;

  passwordChangeModalVis = false;
  userDetailModalVis = false;
  editUserId: string;
  menuNameAccount = false;
  role = Role;

  constructor(
    public userInfoService: UserInfoService,
    public globals: Globals,
    public authInfoService: AuthInfoService) {
  }

  ngOnInit() {
  }

  userClick() {
    this.menuNameAccount = !this.menuNameAccount;
  }

  // アカウント情報詳細
  userDetailClick() {
    this.editUserId = this.userInfoService.userInfo.userId;
    this.userDetailModalVis = true;
  }
  @HostListener('mouseleave')
  onMouseLeave() {
    this.menuNameAccount = false;
  }

  // パスワード変更
  userPassWordClick() {
    this.passwordChangeModalVis = true;
  }

  // 個別詳細
  detailChange(event) {
    this.userDetailModalVis = false;
  }
}
