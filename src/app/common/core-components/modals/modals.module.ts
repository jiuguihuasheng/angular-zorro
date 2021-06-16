/**
 *  モーダル機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';

import { ButtonModule } from '../button/button.module';
import { OverLayModalModule } from '../overlayModal/overlayModal.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    OverLayModalModule
  ],
  declarations: [
    ModalComponent
  ],
  exports: [
    ModalComponent
  ]
})
export class ModalsModule { }
