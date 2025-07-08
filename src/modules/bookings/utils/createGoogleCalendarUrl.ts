import { DateTime } from "luxon";

interface GoogleCalendarParams {
  shopName: string;
  bookingCode: string;
  bookingDate: string;
}

const TIMEZONE = "America/Argentina/Buenos_Aires";

export const createGoogleCalendarUrl = ({
  shopName,
  bookingCode,
  bookingDate
}: GoogleCalendarParams): string => {
  const title = encodeURIComponent(`Reserva en ${shopName}`);
  const details = encodeURIComponent(`Código de reserva: ${bookingCode}`);
  const location = encodeURIComponent(shopName);

  const fixedDate = bookingDate.replace(" ", "T");

  const startDate = DateTime.fromISO(fixedDate, { zone: TIMEZONE });
  const endDate = startDate.plus({ hours: 1 });

  const formatDate = (date: DateTime) =>
    date.toFormat("yyyyLLdd'T'HHmmss");

  const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;

  console.log({ title, dates, details, location });

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
};
