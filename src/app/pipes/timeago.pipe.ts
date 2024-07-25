import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TimeAgo', // Ensure this matches the name used in the template
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return 'just now';
    } else if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diff / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
