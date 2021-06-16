/**
 *  日付ピッカー指令
 *  @version 1.0
 *  @author
 */
import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[cpDatePicker]'
})
export class DatePickerDirective implements OnInit, OnDestroy {
  @Input() options = {};
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
  datePicker;
  element: any;

  constructor(private el: ElementRef) {
    this.element = $(el.nativeElement);
  }

  ngOnInit() {
    const datePicker = this.element.datepicker({
      language: 'ja',
      dateFormat: 'yyyy/mm/dd',
      clearButton: true,
      autoClose: true,
      onShow: (dp, animation) => {
        if (dp.el.value) {
          dp.view = 'days';
          dp.selectedDates = [new Date(dp.el.value)];
          dp.date = dp.selectedDates[0];
        } else {
          dp.selectedDates = [new Date()];
          dp.date = dp.selectedDates[0];
          dp.view = dp.opts.view;
          dp.clear();
          if (dp.timepicker) {
            dp.date = new Date();
            dp.update({
              'hours': new Date().getHours(),
              'minutes': new Date().getMinutes(),
              'seconds': new Date().getSeconds(),
            });
          }
        }
      },
      onHide: (inst, animationCompleted) => {
        if (inst.selectedDates.length <= 0) {
          this.ngModelChange.emit('');
        }
      },
      onSelect: (formattedDate, date, inst) => {
        inst.selectedDates = [inst.lastSelectedDate];
        this.ngModelChange.emit(formattedDate);
      }
    });
    this.datePicker = datePicker.data('datepicker');
  }

  ngOnDestroy() {
    this.datePicker.destroy();
  }
}
