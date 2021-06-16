import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '../../../../common/core-components/button/button.module';
import { PasswordChangeModalComponent } from './password-change-modal.component';
import { OverLayModalModule } from '../../../../common/core-components/overlayModal/overlayModal.module';
import { I18NService } from '../../../../common/core-services/i18n.service';
import { ValidateModule } from '../../../../common/core-components/validate/validate.module';
@NgModule({
  declarations: [
    PasswordChangeModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    I18NService,
    ValidateModule,
    OverLayModalModule
  ],
  exports: [
    PasswordChangeModalComponent
  ]
})
export class PasswordChangeModalModule { }
