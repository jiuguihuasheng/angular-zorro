/**
 *  ラジオボタン機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioComponent } from './radio.component';

@NgModule({
  declarations: [RadioComponent],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    RadioComponent
  ]
})
export class RadioModule { }
