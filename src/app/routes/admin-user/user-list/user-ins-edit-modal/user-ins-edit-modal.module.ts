import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '../../../../common/core-components/button/button.module';
import { UserInsEditModalComponent } from './user-ins-edit-modal.component';
import { OverLayModalModule } from '../../../../common/core-components/overlayModal/overlayModal.module';
import { I18NService } from '../../../../common/core-services/i18n.service';
import { ValidateModule } from '../../../../common/core-components/validate/validate.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [
    UserInsEditModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    I18NService,
    ValidateModule,
    OverLayModalModule,
    NzCheckboxModule,
    NzRadioModule,
    NzInputModule,
    NzDatePickerModule,
    NzToolTipModule
  ],
  exports: [
    UserInsEditModalComponent
  ]
})
export class UserInsEditModalModule { }
