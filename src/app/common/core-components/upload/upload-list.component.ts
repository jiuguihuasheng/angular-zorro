/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

import { ShowUploadListInterface, UploadFile, UploadListType } from './interface';
import { UpdateHostClassService } from './update-host-class.service';

@Component({
  selector: 'upload-list',
  exportAs: 'uploadList',
  templateUrl: './upload-list.component.html',
  styles: [`
    .upload-list-item-name {
      display: inline-block;
      width: 100%;
      padding-left: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `],
  providers: [UpdateHostClassService],
  animations: [
    trigger('itemState', [
      transition(':enter', [
        style({ height: '0', width: '0', opacity: 0 }),
        animate(150, style({ height: '*', width: '*', opacity: 1 }))
      ]),
      transition(':leave', [animate(150, style({ height: '0', width: '0', opacity: 0 }))])
    ])
  ],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadListComponent implements OnChanges {
  private imageTypes = ['jpg', 'pdf'];
  private _items: UploadFile[];

  get showPic(): boolean {
    return this.listType === 'picture' || this.listType === 'picture-card';
  }

  // #region fields

  // tslint:disable-next-line:no-any
  @Input() locale: any = {};
  @Input() listType: UploadListType;
  @Input()
  set items(list: UploadFile[]) {
    list.forEach(file => {
      file.linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
    });
    this._items = list;
  }
  get items(): UploadFile[] {
    return this._items;
  }
  @Input() icons: ShowUploadListInterface;
  @Input() onPreview: (file: UploadFile) => void;
  @Input() onRemove: (file: UploadFile) => void;

  // #endregion

  // #region styles

  private prefixCls = 'ant-upload-list';

  private setClassMap(): void {
    const classMap = {
      [this.prefixCls]: true,
      [`${this.prefixCls}-${this.listType}`]: true
    };
    this.updateHostClassService.updateHostClass(this.el.nativeElement, classMap);
  }

  // #endregion

  // #region render

  private extname(url: string): string {
    const temp = url.split('/');
    const filename = temp[temp.length - 1];
    const filenameWithoutSuffix = filename.split(/#|\?/)[0];
    return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
  }

  isImageUrl(file: UploadFile): boolean {
    // tslint:disable-next-line:no-bitwise
    if (~this.imageTypes.indexOf(file.type)) {
      return true;
    }
    const url: string = (file.thumbUrl || file.url || '') as string;
    if (!url) {
      return false;
    }
    const extension = this.extname(url);
    if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|bmp)$/i.test(extension)) {
      return true;
    } else if (/^data:/.test(url)) {
      // other file types of base64
      return false;
    } else if (extension) {
      // other file types which have extension
      return false;
    }
    return true;
  }

  private previewFile(file: File | Blob, callback: (dataUrl: string) => void): void {
    if (file.type && this.imageTypes.indexOf(file.type) === -1) {
      callback('');
    }
    const reader = new FileReader();
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  private genThumb(): void {
    // tslint:disable-next-line:no-any
    const win = window as any;
    if (
      !this.showPic ||
      typeof document === 'undefined' ||
      typeof win === 'undefined' ||
      !win.FileReader ||
      !win.File
    ) {
      return;
    }
    this.items
      .filter(file => file.originFileObj instanceof File && file.thumbUrl === undefined)
      .forEach(file => {
        file.thumbUrl = '';
        // tslint:disable-next-line:no-non-null-assertion
        this.previewFile(file.originFileObj!, (previewDataUrl: string) => {
          file.thumbUrl = previewDataUrl;
          this.detectChanges();
        });
      });
  }

  showPreview(file: UploadFile): boolean {
    const { showPreviewIcon, hidePreviewIconInNonImage } = this.icons;
    if (!showPreviewIcon) {
      return false;
    }
    return this.isImageUrl(file) ? true : !hidePreviewIconInNonImage;
  }

  handlePreview(file: UploadFile, e: Event): void {
    if (!this.onPreview) {
      return;
    }

    e.preventDefault();
    return this.onPreview(file);
  }

  handleRemove(file: UploadFile, e: Event): void {
    e.preventDefault();
    if (this.onRemove) {
      this.onRemove(file);
    }
    return;
  }

  // #endregion

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private updateHostClassService: UpdateHostClassService,
  ) {}

  detectChanges(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(): void {
    this.setClassMap();
    this.genThumb();
  }
}
