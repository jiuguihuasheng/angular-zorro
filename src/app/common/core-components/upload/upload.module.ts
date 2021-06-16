/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UploadBtnComponent } from './upload-btn.component';
import { UploadListComponent } from './upload-list.component';
import { UploadComponent } from './upload.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [UploadComponent, UploadBtnComponent, UploadListComponent],
  exports: [UploadComponent]
})
export class UploadModule {}
