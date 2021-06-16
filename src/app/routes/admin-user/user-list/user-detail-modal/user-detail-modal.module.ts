import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '../../../../common/core-components/button/button.module';
import { UserDetailModalComponent } from './user-detail-modal.component';
import { OverLayModalModule } from '../../../../common/core-components/overlayModal/overlayModal.module';
import { I18NService } from '../../../../common/core-services/i18n.service';
import { LinkModule } from '../../../../common/core-components/link/link.module';
import { RadioModule } from '../../../../common/core-components/radio/radio.module';
import { UserInsEditModalModule } from '../../user-list/user-ins-edit-modal/user-ins-edit-modal.module';
import { FormatDatePipeModule } from '../../../../shared/pipe/formatDate/format-date.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [
    UserDetailModalComponent,
],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    I18NService,
    LinkModule,
    RadioModule,
    UserInsEditModalModule,
    OverLayModalModule,
    FormatDatePipeModule,
    NzToolTipModule
  ],
  exports: [
    UserDetailModalComponent
  ]
})
export class UserDetailModalModule { }
