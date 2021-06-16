/**
 *  画面レイアウト機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { LinkModule } from '../common/core-components/link/link.module';
import { SwitchModule } from '../common/core-components/switch/switch.module';
import { FormsModule } from '@angular/forms';
import { I18NService } from '../common/core-services/i18n.service';
import { HeaderComponent } from '../layout/header/header.component';
import { SelectModule } from '../common/core-components/select/select.module';
import { RadioModule } from '../common/core-components/radio/radio.module';
import { MenuClickModule } from '../shared/menu-click/menu-click.module';
import { ButtonModule } from '../common/core-components/button/button.module';
import { UserDetailModalModule } from '../routes/admin-user/user-list/user-detail-modal/user-detail-modal.module';
import { PasswordChangeModalModule } from '../routes/admin-user/user-list/password-change-modal/password-change-modal.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SettingOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { NzMenuModule } from 'ng-zorro-antd/menu';

const icons = [ SettingOutline, UserOutline ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LinkModule,
    SelectModule,
    MenuClickModule,
    SwitchModule,
    I18NService,
    ButtonModule,
    RadioModule,
    UserDetailModalModule,
    PasswordChangeModalModule,
    NzLayoutModule,
    NzIconModule.forRoot(icons),
    NzMenuModule
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent
  ],
  exports: [
    LayoutComponent,
    HeaderComponent
  ]
})
export class LayoutModule { }
