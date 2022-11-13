import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'lisibleDate'
})
export class LisibleDatePipe implements PipeTransform {

  transform(value: number): string {
    DateTime.local().setZone('system')
    const diffNow = DateTime.fromMillis(value).diffNow('hours')

    if(diffNow.get('hours') < -168) { // for weeks
      return DateTime.fromMillis(value).toFormat("dd LLL yyyy ', ' HH':'mm")
    }

    if(diffNow.get('hours') < 0 && Math.abs(diffNow.get('hours')) > 1) { // for previous days
      return DateTime.fromMillis(value).toRelativeCalendar({unit: 'days'}) +', '+ DateTime.fromMillis(value).toFormat("HH':'mm")
    }
    
    if(diffNow.hours >= 1) { // after an hour
      return DateTime.fromMillis(value).toFormat("HH':'mm")
    }

    return DateTime.fromMillis(value).toRelative() ?? new Intl.DateTimeFormat('fr-FR').format(value);
  }
}
