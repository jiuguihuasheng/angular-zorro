/**
 *  html body層の追加/廃棄機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverLayModalDirective } from './overlayModal.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    OverLayModalDirective,
  ],
  exports: [
    OverLayModalDirective,
  ]
})
export class OverLayModalModule { }
