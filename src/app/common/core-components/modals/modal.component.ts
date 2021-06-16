/**
 *  モーダル
 *  @version 1.0
 *  @author
 */
import { Component, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { e } from '../event';

export const MODAL_TYPE = {
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'error',
  APIERROR: 'apiError',
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
  ING: 'ing',
};

export const MODAL_SIZE = {
  NORMAL: '',
  SMALL: 'sm',
  LARGE: 'lg'
};

export interface ModalOptions {
  type: string;
  title: string;
  content: string;
  ok: any;
  cancel: any;
  okText: string;
  cancelText: string;
  deleteText: string;
  okBtnClass: string;
  cancelBtnClass: string;
  deleteBtnClass: string;
  textAlign: string;
  ignoreBackdropClick: boolean;
  onHidden: any;
  isOverlay: boolean;
}

export const Modal = function(options) {
  e.modal.emit(options);
};

const default_options = <ModalOptions>{
  type: MODAL_TYPE.INFO,
  title: '',
  content: '',
  ok: () => true,
  cancel: () => { },
  onHidden: () => { },
  okText: '',
  cancelText: '',
  deleteText: '',
  okBtnClass: 'c-Btn__primary c-Btn-lg',
  cancelBtnClass: 'c-Btn__default marginL',
  deleteBtnClass: 'c-Btn__delete',
  textAlign: '',
  ignoreBackdropClick: true,
  isOverlay: true
};

@Component({
  // tslint:disable-next-line
  selector: 'cp-modal',
  templateUrl: './modal.component.html',
  styleUrls: [
    './modal.component.css'
  ],
})
export class ModalComponent implements OnDestroy {

  options: ModalOptions = Object.assign({}, default_options);

  events: Array<any> = [];
  modalDisp = false;

  constructor(private renderer: Renderer2) {
    const modal_event = e.modal.subscribe((options) => {
      if (null === options) {
        return false;
      }

      this.options = Object.assign({}, default_options);

      if (typeof options === 'string') {
        options = { content: options, okText: false, cancelText: false, title: false };
      }

      this.options = Object.assign(this.options, options);

      // if (!this.options.okText && !this.options.cancelText) {
      //   this.options.ignoreClick = false;
      // }

      const onHidden = this.options.onHidden.bind(this.options);
      this.options.onHidden = () => {
        // if (this.options.type !== MODAL_TYPE.CANCEL || onHidden()) {
          this.modalDisp = false;
        // }
        onHidden();
      };

      const ok = this.options.ok.bind(this.options);
      this.options.ok = () => {
        const close = ok();
        if (close) {
          this.modalDisp = false;
        }
      };

      const cancel = this.options.cancel.bind(this.options);
      this.options.cancel = () => {
        const close = cancel();
        if (close) {
          this.modalDisp = false;
        }
      };

      this.modalDisp = true;
    });

    this.events.push(modal_event);
  }

  ngOnDestroy() {
    this.events.map((x) => x.unsubscribe());
  }

  clickHidden() {
    if (this.options.ignoreBackdropClick) {
      this.options.onHidden();
    }
  }
}
