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