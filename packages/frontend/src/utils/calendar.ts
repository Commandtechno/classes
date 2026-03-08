export const START_HOUR = 7;
export const END_HOUR = 21;
export const TOTAL_HALF_HOURS = (END_HOUR - START_HOUR) * 2;
export const ROW_HEIGHT = 28;

export const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function parseTime(t: string): { hours: number; minutes: number } {
  const n = parseInt(t);
  return { hours: Math.floor(n / 100), minutes: n % 100 };
}

export function timeToMinutesFromStart(t: string): number {
  const { hours, minutes } = parseTime(t);
  return (hours - START_HOUR) * 60 + minutes;
}

export function topOffset(mins: number): number {
  return (mins / 30) * ROW_HEIGHT;
}

export function blockHeight(startMins: number, endMins: number): number {
  return ((endMins - startMins) / 30) * ROW_HEIGHT;
}

export function formatTime(t: string): string {
  const { hours, minutes } = parseTime(t);
  const suffix = hours >= 12 ? "p" : "a";
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return minutes === 0 ? `${h}${suffix}` : `${h}:${minutes.toString().padStart(2, "0")}${suffix}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)}-${formatTime(end)}`;
}

export function currentTimeOffset(): number | null {
  const now = new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) return null;
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (hours < START_HOUR || hours >= END_HOUR) return null;
  const totalMin = (hours - START_HOUR) * 60 + minutes;
  return (totalMin / 30) * ROW_HEIGHT;
}

export function currentDayIndex(): number | null {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return null;
  return day - 1;
}

export function timeSlots(): string[] {
  const slots: string[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    slots.push(`${h}:00`);
    slots.push(`${h}:30`);
  }
  return slots;
}

export function formatSlotLabel(slot: string): string {
  const [hStr, min] = slot.split(":");
  const h = parseInt(hStr);
  if (min === "30") return "";
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display} ${suffix}`;
}
