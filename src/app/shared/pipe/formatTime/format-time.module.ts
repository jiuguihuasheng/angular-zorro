/**
 *  Time pipe モジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatTimePipe } from './format-time.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormatTimePipe],
  exports: [FormatTimePipe],
})
export class FormatTimePipeModule { }
