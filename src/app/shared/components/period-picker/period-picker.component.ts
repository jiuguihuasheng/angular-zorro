/**
 *  期間選択
 *  @version 1.0
 *  @author
 */
import {
  Component, ElementRef, OnDestroy, OnInit, Input, Output, EventEmitter, forwardRef, Renderer2,
  ViewChild, ChangeDetectorRef, TemplateRef, ContentChildren, QueryList, NgZone, ChangeDetectionStrategy, AfterContentInit
} from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { PrimeTemplateDirective } from './period-picker';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomHandler } from '../../../common/core-components/dom/domhandler';
import * as _ from 'lodash';
import * as moment from 'moment';

export interface LocaleSettings {
  firstDayOfWeek?: number;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
  today: string;
  clear: string;
  dateFormat?: string;
  weekHeader?: string;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'period-picker',
  templateUrl: './period-picker.component.html',
  styleUrls: ['./period-picker.component.css'],
  animations: [
    trigger('overlayAnimation', [
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => visible', [
        style({ transform: 'translateY(5%)', opacity: 0 }),
        animate('{{showTransitionParams}}')
      ]),
      transition('visible => void', [
        animate(('{{hideTransitionParams}}'),
          style({
            opacity: 0,
            transform: 'translateY(5%)'
          }))
      ]),
    ])
  ],
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PeriodPickerComponent),
    multi: true
  }, DomHandler],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodPickerComponent implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit {

  @ViewChild('contentWrapper') set content(content: ElementRef) {
    this.contentViewChild = content;

    if (this.contentViewChild) {
      if (this.isMonthNavigate) {
        Promise.resolve(null).then(() => this.updateFocus());
        this.isMonthNavigate = false;
      } else {
        this.initFocusableCell();
      }
    }
  }

  @Input() get minDate(): Date {
    return this._minDate;
  }

  set minDate(date: Date) {
    this._minDate = date;

    if (this.currentMonth !== undefined && this.currentMonth != null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @Input() get maxDate(): Date {
    return this._maxDate;
  }

  set maxDate(date: Date) {
    this._maxDate = date;

    if (this.currentMonth !== undefined && this.currentMonth != null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @Input() get disabledDates(): Date[] {
    return this._disabledDates;
  }

  set disabledDates(disabledDates: Date[]) {
    this._disabledDates = disabledDates;
    if (this.currentMonth !== undefined && this.currentMonth != null && this.currentYear) {

      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  @Input() get disabledDays(): number[] {
    return this._disabledDays;
  }

  set disabledDays(disabledDays: number[]) {
    this._disabledDays = disabledDays;

    if (this.currentMonth !== undefined && this.currentMonth != null && this.currentYear) {
      this.createMonths(this.currentMonth, this.currentYear);
    }
  }

  get locale() {
    return this._locale;
  }

  @Input()
  set locale(newLocale: LocaleSettings) {
    this._locale = newLocale;
    if (this.unit !== '6ヵ月') {
      this.createWeekDays();
      this.createMonths(this.currentMonth, this.currentYear);
    } else {
      this.createMonthPickerValues();
    }
  }

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public cd: ChangeDetectorRef,
    private zone: NgZone,
    private domHandler: DomHandler) { }

  @Input() defaultDate: Date;

  @Input() inputStyleClass: string;

  @Input() dateFormat = 'yy/mm/dd';

  @Input() multipleSeparator = ',';

  @Input() rangeSeparator = '～';

  @Input() showOtherMonths = true;

  @Input() selectOtherMonths: boolean;

  @Input() appendTo: any;

  @Input() readonlyInput: boolean;

  @Input() shortYearCutoff: any = '+10';

  @Input() required: boolean;

  @Input() unit = '1週間';

  @Input() dataType = 'date';

  @Input() maxDateCount: number;

  @Input() autoZIndex = true;

  @Input() baseZIndex = 0;

  @Input() panelStyleClass: string;

  @Input() panelStyle: any;

  @Input() keepInvalid = false;

  @Input() numberOfMonths = 1;

  @Input() showTransitionOptions = '225ms ease-out';

  @Input() hideTransitionOptions = '195ms ease-in';

  @Output() focus: EventEmitter<any> = new EventEmitter();

  @Output() blur: EventEmitter<any> = new EventEmitter();

  @Output() close: EventEmitter<any> = new EventEmitter();

  @Output() select: EventEmitter<any> = new EventEmitter();

  @Output() input: EventEmitter<any> = new EventEmitter();

  @Output() clearClick: EventEmitter<any> = new EventEmitter();

  @Output() monthChange: EventEmitter<any> = new EventEmitter();

  @Output() yearChange: EventEmitter<any> = new EventEmitter();

  @Output() clickOutside: EventEmitter<any> = new EventEmitter();

  @Output() show: EventEmitter<any> = new EventEmitter();

  @ContentChildren(PrimeTemplateDirective) templates: QueryList<any>;

  _locale: LocaleSettings = {
    firstDayOfWeek: 1,
    dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
    dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
    monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    today: '今日',
    clear: 'クリア',
    dateFormat: 'yy/mm/dd',
    weekHeader: '週番号',
    startDate: '開始日',
    endDate: '終了日',
  };

  @Input() tabindex: number;

  @ViewChild('inputfield') inputfieldViewChild: ElementRef;

  contentViewChild: ElementRef;

  value: any;

  selectedDate: any;
  selectedDateCopy: any;
  startDate: any;
  startDateCopy: any;

  dates: any[];

  months: any[];

  weeks: any[];

  monthPickerValues: any[];

  weekDays: string[];

  currentMonth: number;

  currentYear: number;

  pm: boolean;

  mask: HTMLDivElement;

  maskClickListener: Function;

  overlay: HTMLDivElement;

  overlayVisible: boolean;

  calendarElement: any;

  documentClickListener: any;

  ticksTo1970: number;

  yearOptions: number[];

  isfocus: boolean;

  isKeydown: boolean;

  filled: boolean;

  inputFieldValue: string = null;

  _minDate: Date;

  _maxDate: Date;

  preventDocumentListener: boolean;

  dateTemplate: TemplateRef<any>;

  disabledDateTemplate: TemplateRef<any>;

  _disabledDates: Array<Date>;

  _disabledDays: Array<number>;

  selectElement: any;

  todayElement: any;

  focusElement: any;

  documentResizeListener: any;

  navigationState: any = null;

  isMonthNavigate: boolean;

  onModelChange: Function = () => { };

  onModelTouched: Function = () => { };

  ngOnInit() {
    const date = this.defaultDate || new Date();
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    this.populateYearOptions(2000, this.currentYear);

    this.createWeekDays();
    this.createMonths(this.currentMonth, this.currentYear);
    // tslint:disable-next-line:max-line-length
    this.ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);
    this.createMonthPickerValues();
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'date':
          this.dateTemplate = item.template;
          break;

        case 'disabledDate':
          this.disabledDateTemplate = item.template;
          break;

        default:
          this.dateTemplate = item.template;
          break;
      }
    });
  }

  populateYearOptions(start, end) {
    this.yearOptions = [];
    for (let i = start; i <= end; i++) {
      this.yearOptions.push(i);
    }
  }

  /**thead */
  createWeekDays() {
    this.weekDays = [];
    let dayIndex = this.locale.firstDayOfWeek;
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(this.locale.dayNamesMin[dayIndex]);
      dayIndex = (dayIndex === 6) ? 0 : ++dayIndex;
    }
  }

  /**6ヵ月 tbody */
  createMonthPickerValues() {
    this.monthPickerValues = [];
    for (let i = 0; i <= 11; i++) {
      this.monthPickerValues.push(this.locale.monthNamesShort[i]);
    }
  }

  /**8週間 tbody */
  createMonths(month: number, year: number) {
    this.months = this.months = [];
    this.weeks = this.weeks = [];
    if (this.unit === '8週間') {
      this.weeks = _.cloneDeep(this.getWeekInfo(year));
      // console.log(this.weeks);
    }
    for (let i = 0; i < this.numberOfMonths; i++) {
      let m = month + i;
      let y = year;
      if (m > 11) {
        m = m % 11 - 1;
        y = year + 1;
      }
      this.months.push(this.createMonth(m, y));
    }
  }

  /**8週間 tbody*/
  getWeekInfo(year) {
    const weeks = [];
    const d = new Date(year, 0, 1);
    while (d.getDay() !== this.locale.firstDayOfWeek) {
      d.setDate(d.getDate() + 1);
    }
    const to = new Date(year + 1, 0, 1);
    let i = 1;
    for (const from = d; from < to;) {
      const startDate = from.getMonth() + 1 + '/' + from.getDate();
      let endDate = '';
      from.setDate(from.getDate() + 6);
      if (from < to) {
        endDate = from.getMonth() + 1 + '/' + from.getDate();
        from.setDate(from.getDate() + 1);
      } else {
        endDate = from.getMonth() + 1 + '/' + from.getDate();
        to.setDate(to.getDate() - 1);
      }
      weeks.push({
        startYear: year,
        endYear: from.getFullYear(),
        startDate: startDate,
        endDate: endDate,
        no: i
      });
      i++;
    }
    return weeks;
  }

  /**1週間 tbody */
  createMonth(month: number, year: number) {
    const dates = [];
    const firstDay = this.getFirstDayOfMonthIndex(month, year);
    const daysLength = this.getDaysCountInMonth(month, year);
    const prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
    let dayNo = 1;
    const today = new Date();
    const monthRows = Math.ceil((daysLength + firstDay) / 7);

    for (let i = 0; i < monthRows; i++) {
      const week = [];

      if (i === 0) {
        for (let j = (prevMonthDaysLength - firstDay + 1); j <= prevMonthDaysLength; j++) {
          const prev = this.getPreviousMonthAndYear(month, year);
          week.push({
            day: j, month: prev.month, year: prev.year, otherMonth: true,
            today: this.isToday(today, j, prev.month, prev.year), selectable: this.isSelectable(j, prev.month, prev.year, true)
          });
        }

        const remainingDaysLength = 7 - week.length;
        for (let j = 0; j < remainingDaysLength; j++) {
          week.push({
            day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
            selectable: this.isSelectable(dayNo, month, year, false)
          });
          dayNo++;
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (dayNo > daysLength) {
            const next = this.getNextMonthAndYear(month, year);
            week.push({
              day: dayNo - daysLength, month: next.month, year: next.year, otherMonth: true,
              today: this.isToday(today, dayNo - daysLength, next.month, next.year),
              selectable: this.isSelectable((dayNo - daysLength), next.month, next.year, true)
            });
          } else {
            week.push({
              day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
              selectable: this.isSelectable(dayNo, month, year, false)
            });
          }
          dayNo++;
        }
      }
      dates.push(week);
    }

    return {
      month: month,
      year: year,
      dates: dates
    };
  }

  /**＜ボタンクリック */
  navBackward(event) {
    event.stopPropagation();
    this.isMonthNavigate = true;
    if (this.unit !== '1週間') {
      this.decrementYear();
      setTimeout(() => {
        this.updateFocus();
      }, 1);
    } else {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.decrementYear();
      } else {
        this.currentMonth--;
      }
    }
    this.monthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    this.createMonths(this.currentMonth, this.currentYear);
  }

  /**＞ボタンクリック */
  navForward(event) {
    event.stopPropagation();
    this.isMonthNavigate = true;
    if (this.unit !== '1週間') {
      this.incrementYear();
      setTimeout(() => {
        this.updateFocus();
      }, 1);
    } else {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.incrementYear();
      } else {
        this.currentMonth++;
      }
    }
    this.monthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    this.createMonths(this.currentMonth, this.currentYear);
  }

  decrementYear() {
    this.currentYear--;
    if (this.currentYear < this.yearOptions[0]) {
      const difference = this.yearOptions[this.yearOptions.length - 1] - this.yearOptions[0];
      this.populateYearOptions(this.yearOptions[0] - difference, this.yearOptions[this.yearOptions.length - 1] - difference);
    }
  }

  incrementYear() {
    this.currentYear++;
    if (this.currentYear > this.yearOptions[this.yearOptions.length - 1]) {
      const difference = this.yearOptions[this.yearOptions.length - 1] - this.yearOptions[0];
      this.populateYearOptions(this.yearOptions[0] + difference, this.yearOptions[this.yearOptions.length - 1] + difference);
    }
  }

  /**1週間選択 */
  oneWeekSelect(event, dateMeta, week?: any) {
    // console.log(week);
    // console.log(dateMeta)
    this.selectDate(dateMeta, week);
    // this.autoClose(event);
    // this.updateInputfield();
    event.preventDefault();
  }

  /**8週間選択 */
  eightWeekSelect(event, week?: any, weeks?: any) {
    const no = week.no;
    const end = week.endDate;
    const endArr = end.split('/');
    const endDate = new Date(week.endYear, endArr[0] - 1, endArr[1]);
    let startYear = null;
    let start = null;
    if (no >= 8) {
      const i = no - 8;
      start = weeks[i].startDate;
      startYear = weeks[i].startYear;
    } else {
      const prevYearWeeks = this.getWeekInfo(week.endYear - 1);
      const i = prevYearWeeks.length - (8 - no);
      start = prevYearWeeks[i].startDate;
      startYear = prevYearWeeks[i].startYear;
    }
    const startArr = start.split('/');
    const startDate = new Date(startYear, startArr[0] - 1, startArr[1]);
    this.updateModel([startDate, endDate]);
    this.startDate = startDate;
    this.selectedDate = endDate;
    // this.select.emit(endDate);
    // this.autoClose(event);
    // this.updateInputfield();
    event.preventDefault();
  }

  /**6ヵ月選択 */
  sixMonthSelect(event, m) {
    let year = this.currentYear;
    let start = null;
    if (m >= 6) {
      start = m - 5;
    } else {
      year -= 1;
      start = 12 - (5 - m);
    }
    const startDate = new Date(year, start - 1, 1);
    const endDate = moment(this.currentYear + '-' + m, 'YYYY-M').endOf('month').toDate();
    this.updateModel([startDate, endDate]);
    this.selectedDate = endDate;
    this.startDate = startDate;
    // this.select.emit(endDate);
    // this.autoClose(event);
    // this.updateInputfield();
    event.preventDefault();
  }

  /**OKボタン */
  okClick = () => {
    this.select.emit(this.selectedDate);
    this.startDateCopy = this.startDate;
    this.selectedDateCopy = this.selectedDate;
    this.updateInputfield();
    this.autoClose(event);
  }

  /**期間を選択したら、ポップアップを閉じます */
  autoClose = (event) => {
    setTimeout(() => {
      event.preventDefault();
      this.hideOverlay();
      if (this.mask) {
        this.disableModality();
      }
      this.cd.markForCheck();
    }, 150);
  }

  /**期間値を更新 */
  updateInputfield() {
    let formattedValue = '';
    if (this.value) {
      if (this.value.length) {
        const startDate = this.value[0];
        const endDate = this.value[1];
        formattedValue = this.formatDateTime(startDate);
        if (endDate) {
          formattedValue += ' ' + this.rangeSeparator + ' ' + this.formatDateTime(endDate);
        }
      }
    }
    this.inputFieldValue = formattedValue;
    this.updateFilledState();
    if (this.inputfieldViewChild && this.inputfieldViewChild.nativeElement) {
      this.inputfieldViewChild.nativeElement.value = this.inputFieldValue;
    }
  }

  formatDateTime(date) {
    let formattedValue = null;
    if (date) {
      formattedValue = this.formatDate(date, this.getDateFormat());
    }
    return formattedValue;
  }

  selectDate(dateMeta, week?: any) {
    let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
    if (this.minDate && this.minDate > date) {
      date = this.minDate;
    }
    if (this.maxDate && this.maxDate < date) {
      date = this.maxDate;
    }
    const startDate = new Date(week[0].year, week[0].month, week[0].day);
    const endDate = new Date(week[6].year, week[6].month, week[6].day);
    this.updateModel([startDate, endDate]);
    this.selectedDate = endDate;
    this.startDate = startDate;
    // this.select.emit(date);
  }

  updateModel(value) {
    this.value = value;
    this.onModelChange(this.value);
  }

  getFirstDayOfMonthIndex(month: number, year: number) {
    const day = new Date();
    day.setDate(1);
    day.setMonth(month);
    day.setFullYear(year);
    const dayIndex = day.getDay() + this.getSundayIndex();
    return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
  }

  getDaysCountInMonth(month: number, year: number) {
    return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
  }

  getDaysCountInPrevMonth(month: number, year: number) {
    const prev = this.getPreviousMonthAndYear(month, year);
    return this.getDaysCountInMonth(prev.month, prev.year);
  }

  getPreviousMonthAndYear(month: number, year: number) {
    let m, y;
    if (month === 0) {
      m = 11;
      y = year - 1;
    } else {
      m = month - 1;
      y = year;
    }
    return { 'month': m, 'year': y };
  }

  getNextMonthAndYear(month: number, year: number) {
    let m, y;
    if (month === 11) {
      m = 0;
      y = year + 1;
    } else {
      m = month + 1;
      y = year;
    }
    return { 'month': m, 'year': y };
  }

  getSundayIndex() {
    return this.locale.firstDayOfWeek > 0 ? 7 - this.locale.firstDayOfWeek : 0;
  }

  /**選択されたかどうか*/
  isSelected(dateMeta, week?: any, weeks?: any): boolean {
    if (!this.selectedDateCopy) {
      this.startDateCopy = this.value[0];
      this.selectedDateCopy = this.value[1];
    }
    if (this.unit === '1週間') {
      if (this.value.length) {
        if (week[0]['day'] === this.value[0].getDate() &&
          week[0]['month'] === this.value[0].getMonth() &&
          week[0]['year'] === this.value[0].getFullYear() &&
          week[6]['day'] === this.value[1].getDate() &&
          week[6]['month'] === this.value[1].getMonth() &&
          week[6]['year'] === this.value[1].getFullYear()
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else if (this.unit === '8週間') {
      if (this.value.length) {
        const startVal = this.value[0].getTime();
        const endVal = this.value[1].getTime();
        const startArr = week.startDate.split('/');
        const endArr = week.endDate.split('/');
        const startDate = new Date(week.startYear, (startArr[0] - 1), startArr[1]).getTime();
        const endDate = new Date(week.endYear, (endArr[0] - 1), endArr[1]).getTime();
        if (startDate >= startVal && endDate <= endVal) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  /**6ヵ月 選択されたかどうか*/
  isMonthSelected(month: number, year: number): boolean {
    if (this.value.length) {
      const startVal = this.value[0].getTime();
      const endVal = this.value[1].getTime();
      const val = new Date(year, month, 1).getTime();
      if (val >= startVal && val <= endVal) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isToday(today, day, month, year): boolean {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  }

  isSelectable(day, month, year, otherMonth): boolean {
    let validMin = true;
    let validMax = true;
    let validDate = true;
    let validDay = true;
    if (otherMonth && !this.selectOtherMonths) {
      return false;
    }
    if (this.minDate) {
      if (this.minDate.getFullYear() > year) {
        validMin = false;
      } else if (this.minDate.getFullYear() === year) {
        if (this.minDate.getMonth() > month) {
          validMin = false;
        } else if (this.minDate.getMonth() === month) {
          if (this.minDate.getDate() > day) {
            validMin = false;
          }
        }
      }
    }
    if (this.maxDate) {
      if (this.maxDate.getFullYear() < year) {
        validMax = false;
      } else if (this.maxDate.getFullYear() === year) {
        if (this.maxDate.getMonth() < month) {
          validMax = false;
        } else if (this.maxDate.getMonth() === month) {
          if (this.maxDate.getDate() < day) {
            validMax = false;
          }
        }
      }
    }
    if (this.disabledDates) {
      validDate = !this.isDateDisabled(day, month, year);
    }
    if (this.disabledDays) {
      validDay = !this.isDayDisabled(day, month, year);
    }
    return validMin && validMax && validDate && validDay;
  }

  isDateDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDates) {
      for (const disabledDate of this.disabledDates) {
        if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
          return true;
        }
      }
    }
    return false;
  }

  isDayDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDays) {
      const weekday = new Date(year, month, day);
      const weekdayNumber = weekday.getDay();
      return this.disabledDays.indexOf(weekdayNumber) !== -1;
    }
    return false;
  }

  inputFocus(event: Event) {
    this.isfocus = true;
    this.showOverlay();
    this.focus.emit(event);
  }

  inputClick() {
    if (this.overlay && this.autoZIndex) {
      this.overlay.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
    }
    if (!this.overlayVisible) {
      this.showOverlay();
    }
  }

  inputBlur(event: Event) {
    this.isfocus = false;
    this.blur.emit(event);
    if (!this.keepInvalid) {
      this.updateInputfield();
    }
    this.onModelTouched();
  }

  onButtonClick(event, inputfield) {
    if (!this.overlayVisible) {
      inputfield.focus();
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  onPrevButtonClick(event) {
    this.navigationState = { backward: true, button: true };
    this.navBackward(event);
  }

  onNextButtonClick(event) {
    this.navigationState = { backward: false, button: true };
    this.navForward(event);
  }

  updateFocus() {
    let cell;
    if (this.navigationState) {
      if (this.navigationState.button) {
        this.initFocusableCell();
        if (this.navigationState.backward) {
          this.domHandler.findSingle(this.contentViewChild.nativeElement, '.ui-datepicker-prev').focus();
        } else {
          this.domHandler.findSingle(this.contentViewChild.nativeElement, '.ui-datepicker-next').focus();
        }
      } else {
        if (this.navigationState.backward) {
          const cells = this.domHandler.find(this.contentViewChild.nativeElement, '.ui-datepicker-calendar td a');
          cell = cells[cells.length - 1];
        } else {
          cell = this.domHandler.findSingle(this.contentViewChild.nativeElement, '.ui-datepicker-calendar td a');
        }
        if (cell) {
          cell.tabIndex = '0';
          cell.focus();
        }
      }
      this.navigationState = null;
    } else {
      this.initFocusableCell();
    }
  }

  initFocusableCell() {
    let cell;
    if (this.unit === '6ヵ月') {
      // tslint:disable-next-line:max-line-length
      const cells = this.domHandler.find(this.contentViewChild.nativeElement, '.ui-monthpicker .ui-monthpicker-month:not(.ui-state-disabled)');
      // tslint:disable-next-line:max-line-length
      const selectedCell = this.domHandler.findSingle(this.contentViewChild.nativeElement, '.ui-monthpicker .ui-monthpicker-month.ui-state-highlight');
      cells.forEach(e => e.tabIndex = -1);
      cell = selectedCell || cells[0];

      if (cells.length === 0) {
        // tslint:disable-next-line:max-line-length
        const disabledCells = this.domHandler.find(this.contentViewChild.nativeElement, '.ui-monthpicker .ui-monthpicker-month.ui-state-disabled[tabindex = "0"]');
        disabledCells.forEach(e => e.tabIndex = -1);
      }
    } else {
      cell = this.domHandler.findSingle(this.contentViewChild.nativeElement, 'a.ui-state-active');
      if (!cell) {
        // tslint:disable-next-line:max-line-length
        const todayCell = this.domHandler.findSingle(this.contentViewChild.nativeElement, 'td.ui-datepicker-today a:not(.ui-state-disabled)');
        if (todayCell) {
          cell = todayCell;
        } else {
          cell = this.domHandler.findSingle(this.contentViewChild.nativeElement, '.ui-datepicker-calendar td a');
        }
      }
    }
    if (cell) {
      cell.tabIndex = '0';
    }
  }

  /**monthプルダウン */
  onMonthDropdownChange(m: string) {
    // tslint:disable-next-line:radix
    this.currentMonth = parseInt(m);
    this.monthChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    this.createMonths(this.currentMonth, this.currentYear);
  }

  /**yearプルダウン */
  onYearDropdownChange(y: string) {
    // tslint:disable-next-line:radix
    this.currentYear = parseInt(y);
    this.yearChange.emit({ month: this.currentMonth + 1, year: this.currentYear });
    this.createMonths(this.currentMonth, this.currentYear);
  }

  /**popup初期化(現在の日付または選択した日付) */
  updateUI() {
    let val = this.selectedDateCopy || this.defaultDate || new Date();
    if (Array.isArray(val)) {
      val = val[0];
    }
    this.currentMonth = val.getMonth();
    this.currentYear = val.getFullYear();
    this.createMonths(this.currentMonth, this.currentYear);
  }

  /**popup表示 */
  showOverlay() {
    if (!this.overlayVisible) {
      this.updateUI();
      this.overlayVisible = true;
    }
  }

  /**popup閉じる */
  hideOverlay() {
    if (this.selectedDateCopy) {
      if (this.selectedDateCopy !== this.selectedDate) {
        this.value = [this.startDateCopy, this.selectedDateCopy];
      }
    } else {
      this.value = [];
    }
    this.overlayVisible = false;
  }

  toggle() {
    if (!this.overlayVisible) {
      this.showOverlay();
      this.inputfieldViewChild.nativeElement.focus();
    } else {
      this.hideOverlay();
    }
  }

  onOverlayAnimationStart(event: AnimationEvent) {
    switch (event.toState) {
      case 'visible':
        this.overlay = event.element;
        this.appendOverlay();
        if (this.autoZIndex) {
          this.overlay.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
        this.alignOverlay();
        this.show.emit(event);
        break;

      case 'void':
        this.onOverlayHide();
        this.close.emit(event);
        break;
    }
  }

  onOverlayAnimationDone(event: AnimationEvent) {
    switch (event.toState) {
      case 'visible':
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        break;
    }
  }

  appendOverlay() {
    if (this.appendTo) {
      if (this.appendTo === 'body') {
        document.body.appendChild(this.overlay);
      } else {
        this.domHandler.appendChild(this.overlay, this.appendTo);
      }
    }
  }

  restoreOverlayAppend() {
    if (this.overlay && this.appendTo) {
      this.el.nativeElement.appendChild(this.overlay);
    }
  }

  alignOverlay() {
    if (this.appendTo) {
      this.domHandler.absolutePosition(this.overlay, this.inputfieldViewChild.nativeElement);
    } else {
      this.domHandler.relativePosition(this.overlay, this.inputfieldViewChild.nativeElement);
    }
  }

  enableModality(element) {
    if (!this.mask) {
      this.mask = document.createElement('div');
      // tslint:disable-next-line:radix
      this.mask.style.zIndex = String(parseInt(element.style.zIndex) - 1);
      const maskStyleClass = 'ui-widget-overlay ui-datepicker-mask ui-datepicker-mask-scrollblocker';
      this.domHandler.addMultipleClasses(this.mask, maskStyleClass);
      this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
        this.disableModality();
      });
      document.body.appendChild(this.mask);
      this.domHandler.addClass(document.body, 'ui-overflow-hidden');
    }
  }

  disableModality() {
    if (this.mask) {
      document.body.removeChild(this.mask);
      const bodyChildren = document.body.children;
      let hasBlockerMasks: boolean;
      for (let i = 0; i < bodyChildren.length; i++) {
        const bodyChild = bodyChildren[i];
        if (this.domHandler.hasClass(bodyChild, 'ui-datepicker-mask-scrollblocker')) {
          hasBlockerMasks = true;
          break;
        }
      }
      if (!hasBlockerMasks) {
        this.domHandler.removeClass(document.body, 'ui-overflow-hidden');
      }
      this.unbindMaskClickListener();
      this.mask = null;
    }
  }

  unbindMaskClickListener() {
    if (this.maskClickListener) {
      this.maskClickListener();
      this.maskClickListener = null;
    }
  }

  writeValue(value: any): void {
    this.value = value;
    if (!this.value || (this.value && this.value.length === 0)) {
      this.selectedDateCopy = null;
    }
    this.updateInputfield();
    this.updateUI();
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  getDateFormat() {
    return this.dateFormat || this.locale.dateFormat;
  }

  formatDate(date, format) {
    if (!date) {
      return '';
    }
    let iFormat;
    const lookAhead = (match) => {
      const matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
      if (matches) {
        iFormat++;
      }
      return matches;
    },
      formatNumber = (match, value, len) => {
        let num = '' + value;
        if (lookAhead(match)) {
          while (num.length < len) {
            num = '0' + num;
          }
        }
        return num;
      },
      formatName = (match, value, shortNames, longNames) => {
        return (lookAhead(match) ? longNames[value] : shortNames[value]);
      };
    let output = '';
    let literal = false;
    if (date) {
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === '\'' && !lookAhead('\'')) {
            literal = false;
          } else {
            output += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case 'd':
              output += formatNumber('d', date.getDate(), 2);
              break;
            case 'D':
              output += formatName('D', date.getDay(), this.locale.dayNamesShort, this.locale.dayNames);
              break;
            case 'o':
              output += formatNumber('o',
                Math.round((
                  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
                  new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
              break;
            case 'm':
              output += formatNumber('m', date.getMonth() + 1, 2);
              break;
            case 'M':
              output += formatName('M', date.getMonth(), this.locale.monthNamesShort, this.locale.monthNames);
              break;
            case 'y':
              output += lookAhead('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + (date.getFullYear() % 100);
              break;
            case '@':
              output += date.getTime();
              break;
            case '!':
              output += date.getTime() * 10000 + this.ticksTo1970;
              break;
            case '\'':
              if (lookAhead('\'')) {
                output += '\'';
              } else {
                literal = true;
              }
              break;
            default:
              output += format.charAt(iFormat);
          }
        }
      }
    }
    return output;
  }

  parseDate(value, format) {
    if (format == null || value == null) {
      throw new Error('Invalid arguments');
    }
    value = (typeof value === 'object' ? value.toString() : value + '');
    if (value === '') {
      return null;
    }
    let iFormat, dim, extra,
      iValue = 0,
      year = -1,
      month = -1,
      day = -1,
      doy = -1,
      literal = false,
      date;
      // tslint:disable-next-line:max-line-length
      const shortYearCutoff = (typeof this.shortYearCutoff !== 'string' ? this.shortYearCutoff : new Date().getFullYear() % 100 + parseInt(this.shortYearCutoff, 10)),
      lookAhead = (match) => {
        const matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
        if (matches) {
          iFormat++;
        }
        return matches;
      },
      getNumber = (match) => {
        const isDoubled = lookAhead(match),
          size = (match === '@' ? 14 : (match === '!' ? 20 :
            (match === 'y' && isDoubled ? 4 : (match === 'o' ? 3 : 2)))),
          minSize = (match === 'y' ? size : 1),
          digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
          num = value.substring(iValue).match(digits);
        if (!num) {
          // tslint:disable-next-line:no-string-throw
          throw 'Missing number at position ' + iValue;
        }
        iValue += num[0].length;
        return parseInt(num[0], 10);
      },
      getName = (match, shortNames, longNames) => {
        let index = -1;
        const arr = lookAhead(match) ? longNames : shortNames;
        const names = [];

        for (let i = 0; i < arr.length; i++) {
          names.push([i, arr[i]]);
        }
        names.sort((a, b) => {
          return -(a[1].length - b[1].length);
        });
        for (let i = 0; i < names.length; i++) {
          const name = names[i][1];
          if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
            index = names[i][0];
            iValue += name.length;
            break;
          }
        }
        if (index !== -1) {
          return index + 1;
        } else {
          // tslint:disable-next-line:no-string-throw
          throw 'Unknown name at position ' + iValue;
        }
      },
      checkLiteral = () => {
        if (value.charAt(iValue) !== format.charAt(iFormat)) {
          // tslint:disable-next-line:no-string-throw
          throw 'Unexpected literal at position ' + iValue;
        }
        iValue++;
      };
    if (this.unit === '6ヵ月') {
      day = 1;
    }
    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === '\'' && !lookAhead('\'')) {
          literal = false;
        } else {
          checkLiteral();
        }
      } else {
        switch (format.charAt(iFormat)) {
          case 'd':
            day = getNumber('d');
            break;
          case 'D':
            getName('D', this.locale.dayNamesShort, this.locale.dayNames);
            break;
          case 'o':
            doy = getNumber('o');
            break;
          case 'm':
            month = getNumber('m');
            break;
          case 'M':
            month = getName('M', this.locale.monthNamesShort, this.locale.monthNames);
            break;
          case 'y':
            year = getNumber('y');
            break;
          case '@':
            date = new Date(getNumber('@'));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case '!':
            date = new Date((getNumber('!') - this.ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case '\'':
            if (lookAhead('\'')) {
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
        }
      }
    }
    if (iValue < value.length) {
      extra = value.substr(iValue);
      if (!/^\s+/.test(extra)) {
        // tslint:disable-next-line:no-string-throw
        throw 'Extra/unparsed characters found in date: ' + extra;
      }
    }
    if (year === -1) {
      year = new Date().getFullYear();
    } else if (year < 100) {
      year += new Date().getFullYear() - new Date().getFullYear() % 100 +
        (year <= shortYearCutoff ? 0 : -100);
    }
    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        dim = this.getDaysCountInMonth(year, month - 1);
        if (day <= dim) {
          break;
        }
        month++;
        day -= dim;
      } while (true);
    }
    date = this.daylightSavingAdjust(new Date(year, month - 1, day));
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      // tslint:disable-next-line:no-string-throw
      throw 'Invalid date'; // E.g. 31/02/00
    }
    return date;
  }

  daylightSavingAdjust(date) {
    if (!date) {
      return null;
    }
    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
    return date;
  }

  updateFilledState() {
    this.filled = this.inputFieldValue && this.inputFieldValue !== '';
  }

  onClearButtonClick(event) {
    this.updateModel(null);
    this.updateInputfield();
    this.hideOverlay();
    this.clearClick.emit(event);
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.zone.runOutsideAngular(() => {
        this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
          if (this.isOutsideClicked(event) && this.overlayVisible) {
            this.zone.run(() => {
              this.hideOverlay();
              this.clickOutside.emit(event);
              this.cd.markForCheck();
            });
          }
        });
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  bindDocumentResizeListener() {
    if (!this.documentResizeListener) {
      this.documentResizeListener = this.onWindowResize.bind(this);
      window.addEventListener('resize', this.documentResizeListener);
    }
  }

  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      window.removeEventListener('resize', this.documentResizeListener);
      this.documentResizeListener = null;
    }
  }

  isOutsideClicked(event: Event) {
    return !(this.el.nativeElement.isSameNode(event.target) || this.isNavIconClicked(event) ||
      this.el.nativeElement.contains(event.target) || (this.overlay && this.overlay.contains(<Node>event.target)));
  }

  isNavIconClicked(event: Event) {
    // tslint:disable-next-line:max-line-length
    return (this.domHandler.hasClass(event.target, 'ui-datepicker-prev') || this.domHandler.hasClass(event.target, 'ui-datepicker-prev-icon')
      || this.domHandler.hasClass(event.target, 'ui-datepicker-next') || this.domHandler.hasClass(event.target, 'ui-datepicker-next-icon'));
  }

  isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  }

  onWindowResize() {
    if (this.overlayVisible && !this.isAndroid()) {
      this.hideOverlay();
    }
  }

  onOverlayHide() {
    this.unbindDocumentClickListener();
    this.unbindMaskClickListener();
    this.unbindDocumentResizeListener();
    this.overlay = null;
    this.disableModality();
  }

  ngOnDestroy() {
    this.restoreOverlayAppend();
    this.onOverlayHide();
  }
}
