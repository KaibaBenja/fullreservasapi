interface GoogleCalendarParams {
  shopName: string;
  bookingCode: string;
  bookingDate: string;
  bookingTime: string;
}

export const createGoogleCalendarUrl = ({
  shopName,
  bookingCode,
  bookingDate,
  bookingTime
}: GoogleCalendarParams): string => {
  const title = encodeURIComponent(`Reserva en ${shopName}`);
  const details = encodeURIComponent(`Código de reserva: ${bookingCode}`);
  const location = encodeURIComponent(shopName);

  const [hour, minute] = bookingTime.split(":");
  const startDate = new Date(`${bookingDate}T${hour}:${minute}:00`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora después

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]|.\d{3}/g, "");

  const dates = `${formatDate(startDate)}/${formatDate(endDate)}`;

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
};
