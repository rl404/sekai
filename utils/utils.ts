import { Date } from '../types/Types';

const months = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const DateToStr = (date: Date): string => {
  var str = '';

  if (date.year !== 0) str += date.year;

  if (date.month !== 0) str = months[date.month] + ' ' + str;

  if (date.day !== 0) str = date.day + ' ' + str;

  return str;
};

export const PrintDate = (d1: string, d2: string): string => {
  var date = '';
  if (d1 !== '') {
    date += d1;
  }
  if (d2 !== '') {
    date += ' - ' + d2;
  }
  return date;
};
