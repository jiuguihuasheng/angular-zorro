/**
 *  メニュー機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuClickDirective } from './menu-click.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MenuClickDirective],
  exports: [MenuClickDirective]
})
export class MenuClickModule { }
