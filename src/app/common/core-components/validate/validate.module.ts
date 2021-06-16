/**
 *  単項目チェック機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidDirective, ValidateDirective } from './validate.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ValidateDirective, ValidDirective],
  exports: [ValidateDirective, ValidDirective],
})
export class ValidateModule { }
