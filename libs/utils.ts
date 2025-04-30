import { Date } from '@/app/api/anime/[id]/route';
import axios, { AxiosError } from 'axios';

export const getAxiosError = (error: Error | AxiosError): string => {
  if (!axios.isAxiosError(error) || !error.response || !error.response.data || !error.response.data.message) {
    return error.message;
  }
  return error.response.data.message;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DateToStr = (date: Date): string => {
  let str = '';

  if (date.year !== 0) str += date.year;

  if (date.month !== 0) str = months[date.month] + ' ' + str;

  if (date.day !== 0) str = date.day + ' ' + str;

  return str;
};
