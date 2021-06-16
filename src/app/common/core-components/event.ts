import { EventEmitter } from '@angular/core';

export class CommonEvent {
  feedback: EventEmitter<any> = new EventEmitter();
  modal: EventEmitter<any> = new EventEmitter();
  subPageClose: EventEmitter<any> = new EventEmitter();
}

export const e = new CommonEvent();
