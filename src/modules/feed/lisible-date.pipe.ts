import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'lisibleDate'
})
export class LisibleDatePipe implements PipeTransform {

  transform(value: number): string {
    DateTime.local().setZone('system')
    return DateTime.fromMillis(value).toRelativeCalendar() ?? new Intl.DateTimeFormat('fr-FR').format(value);
  }
}
