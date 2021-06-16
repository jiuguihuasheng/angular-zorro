/**
 *  画面レイアウト
 *  @version 1.0
 *  @author
 */
import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../common/core-services/user-info.service';
import { Globals } from '../common/global';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
      .logo {
        height: 4rem;
        padding: 0.25rem;
        background-color: #fff;
      }
      .logo img {
        display: block;
        height: 100%;
        margin: auto;
        width: auto;
        max-width: 62px;
      }

      .layout {
        min-height: 100vh;
      }

      nz-sider {
        overflow: auto;
        height: 100vh;
        color: #fff;
        background-color: #3F6C9D;
      }

      nz-header {
        padding: 0;
      }

      nz-content {
        height: calc(100vh - 4rem);
        overflow: auto;
      }

      .inner-content {
        padding: 24px;
        background: #fff;
        min-height: 360px;
      }

      nz-footer {
        text-align: center;
      }
    `
  ]
})
export class LayoutComponent implements OnInit {

  menuRight = false;
  menuMobileToggle = false;

  constructor(
    public userInfo: UserInfoService,
    public globals: Globals,
  ) { }

  ngOnInit() {
  }

}
