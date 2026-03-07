import type { Course } from "../types.ts";

const BYDAY_MAP: Record<string, string> = {
  "0": "MO",
  "1": "TU",
  "2": "WE",
  "3": "TH",
  "4": "FR",
};

function padTime(t: string): string {
  const n = parseInt(t);
  const h = Math.floor(n / 100);
  const m = n % 100;
  return `${h.toString().padStart(2, "0")}${m.toString().padStart(2, "0")}00`;
}

function formatDate(d: string): string {
  const parts = d.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;
  }
  return d.replace(/-/g, "");
}

function getByDay(meetingTimes: Course["meetingTimes"]): string {
  const days = [...new Set(meetingTimes.map((mt) => BYDAY_MAP[mt.meet_day]).filter(Boolean))];
  return days.join(",");
}

export function generateICS(courses: Course[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CU Boulder Course Scheduler//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const course of courses) {
    if (course.meetingTimes.length === 0) continue;

    const first = course.meetingTimes[0];
    const startDate = formatDate(course.start_date || "08/26/2025");
    const endDate = formatDate(course.end_date || "12/12/2025");
    const byday = getByDay(course.meetingTimes);

    lines.push("BEGIN:VEVENT");
    lines.push(`DTSTART:${startDate}T${padTime(first.start_time)}`);
    lines.push(`DTEND:${startDate}T${padTime(first.end_time)}`);
    if (byday) {
      lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${byday};UNTIL=${endDate}T235959`);
    }
    lines.push(`SUMMARY:${course.code} - ${course.title} (${course.schd} ${course.no})`);
    lines.push(
      `DESCRIPTION:Instructor: ${course.instr || "TBA"}\\nCRN: ${course.crn}\\nCredits: ${course.credits || "N/A"}`
    );
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(courses: Course[]): void {
  const ics = generateICS(courses);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cu-schedule.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(course: Course): string {
  if (course.meetingTimes.length === 0) return "#";

  const first = course.meetingTimes[0];
  const startDate = formatDate(course.start_date || "08/26/2025");
  const endDate = formatDate(course.end_date || "12/12/2025");
  const byday = getByDay(course.meetingTimes);

  const text = encodeURIComponent(`${course.code} - ${course.title}`);
  const dates = `${startDate}T${padTime(first.start_time)}/${startDate}T${padTime(first.end_time)}`;
  const recur = byday ? `RRULE:FREQ=WEEKLY;BYDAY=${byday};UNTIL=${endDate}` : "";
  const details = encodeURIComponent(
    `Instructor: ${course.instr || "TBA"}\nCRN: ${course.crn}\nSection: ${course.schd} ${course.no}\nCredits: ${course.credits || "N/A"}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&recur=${encodeURIComponent(recur)}&details=${details}`;
}
