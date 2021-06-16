/**
 * ユーザー機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserComponent } from './admin-user.component';
import { AdminUserRoutingModule } from './admin-user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { ButtonModule } from '../../common/core-components/button/button.module';
import { CollapseModule } from '../../common/core-components/collapse/collapse.module';
import { LinkModule } from '../../common/core-components/link/link.module';
import { SelectModule } from '../../common/core-components/select/select.module';
import { ValidateModule } from '../../common/core-components/validate/validate.module';
import { OverLayModalModule } from '../../common/core-components/overlayModal/overlayModal.module';
import { I18NService} from '../../common/core-services/i18n.service';
import { UserInsEditModalModule } from './user-list/user-ins-edit-modal/user-ins-edit-modal.module';
import { UserDetailModalModule } from './user-list/user-detail-modal/user-detail-modal.module';
import { FormatDatePipeModule } from 'src/app/shared/pipe/formatDate/format-date.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminUserRoutingModule,
    ButtonModule,
    CollapseModule,
    LinkModule,
    SelectModule,
    ValidateModule,
    OverLayModalModule,
    I18NService,
    UserInsEditModalModule,
    UserDetailModalModule,
    FormatDatePipeModule,
    NzTableModule,
    NzCheckboxModule,
    NzSelectModule,
    NzInputModule,
    NzPaginationModule
  ],
  declarations: [
    AdminUserComponent,
    UserListComponent
  ],
  providers: []
})
export class AdminUserModule { }
