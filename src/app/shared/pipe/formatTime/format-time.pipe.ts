/**
 *  Time pipe
 *  @version 1.0
 *  @author
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '../../helper.service';
import * as _ from 'lodash';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  constructor(private helperService: HelperService) {}

  transform(seconds: any, exponent?: string): string {
    let ret = '';
    if (seconds) {
      const time = this.helperService.formatSeconds(seconds);
      if (exponent === 'HH') {
        ret = time.hours;
      } else {
        ret = `${time.hours}:${time.minutes}:${time.seconds}`;
      }
    }
    return ret;
  }
}
