export function parseTime(time: string): number {
  if (!/^\d{2}:\d{2}$/.test(time)) throw new Error(`Formato incorrecto: ${time}`);

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`; // Agregamos ":00"
};

export const validateTimes = (open_time: string, close_time: string): string | null => {
  if (open_time === close_time) {
    return "El horario de apertura y cierre no pueden ser iguales.";
  };

  const openMinutes = parseTime(open_time);
  const closeMinutes = parseTime(close_time);

  if (closeMinutes <= openMinutes) {
    return "El horario de cierre debe ser posterior al de apertura.";
  };

  return null;
};