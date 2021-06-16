/**
 *  期間選択機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodPickerComponent } from './period-picker.component';

@NgModule({
  declarations: [PeriodPickerComponent],
  imports: [
    CommonModule
  ],
  exports: [PeriodPickerComponent]
})
export class PeriodPickerModule { }
