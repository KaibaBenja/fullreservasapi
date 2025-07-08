import { DateTime } from 'luxon';

const TIMEZONE = 'America/Argentina/Buenos_Aires';
const FORMAT = 'yyyy-MM-dd HH:mm';

//Formatea un objeto DateTime al formato 'yyyy-dd-MM HH:mm'. 
export function formatDateString(dateTime: DateTime): string {
  return dateTime.setZone(TIMEZONE).toFormat(FORMAT);
}

// Devuelve la fecha actual en GMT-3 (Argentina) ya formateada.
export function getCurrentDateFormatted(): string {
  return DateTime.now().setZone(TIMEZONE).toFormat(FORMAT);
}

// Verifica si una fecha (en formato 'yyyy-dd-MM HH:mm') es anterior a la actual en GMT-3.
export function isBeforeNow(dateString: string): boolean {
  const inputDate = DateTime.fromFormat(dateString, FORMAT, { zone: TIMEZONE });
  const now = DateTime.now().setZone(TIMEZONE);
  return inputDate < now;
}

// Verifica si una fecha (en formato 'yyyy-dd-MM HH:mm') está dentro del rango actual y dos meses hacia adelante.
export function isWithinValidRange(dateString: string): boolean {
  const inputDate = DateTime.fromFormat(dateString, FORMAT, { zone: TIMEZONE });

  if (!inputDate.isValid) return false;

  const now = DateTime.now().setZone(TIMEZONE);
  const maxAllowed = now.plus({ months: 2 });

  return inputDate >= now && inputDate <= maxAllowed;
}

export function getTimeFromDatetime(datetime: string, timezone = TIMEZONE): string {
  const fixedDatetime = datetime.replace(" ", "T");
  return DateTime.fromISO(fixedDatetime).setZone(timezone).toFormat("HH:mm");
}