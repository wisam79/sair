import {
  format,
  addMonths,
  addDays,
  formatDistanceToNow,
  startOfDay,
  startOfWeek,
  isSameMonth,
  differenceInDays,
  Locale,
} from 'date-fns';
import { arSA } from 'date-fns/locale';

export { arSA, format };

export function formatArabicDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd MMMM yyyy', { locale: arSA });
}

export function formatRelativeArabic(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: arSA });
}

export function addMonthsToDate(date: Date, months: number): Date {
  return addMonths(date, months);
}

export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function formatTimeArabic(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'h:mm a', { locale: arSA });
}

export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 6 }); // Saturday for Arabic locale
}

export function isSameMonthDate(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return isSameMonth(d1, d2);
}

export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return differenceInDays(d1, d2);
}

export function getCurrentDateString(): string {
  return formatDateShort(new Date());
}

export function getFutureDateString(daysToAdd: number): string {
  return formatDateShort(addDaysToDate(new Date(), daysToAdd));
}

export function formatArabicDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'd MMMM yyyy h:mm a', { locale: arSA });
}

export function formatArabicDayName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE', { locale: arSA });
}

export function getCurrentISOString(): string {
  return new Date().toISOString();
}
