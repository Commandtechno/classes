import type { Course } from "../types.ts";

export function hasConflict(newCourse: Course, scheduledCourses: Course[]): Course | null {
  for (const scheduled of scheduledCourses) {
    if (scheduled.crn === newCourse.crn) continue;
    for (const newTime of newCourse.meetingTimes) {
      for (const schedTime of scheduled.meetingTimes) {
        if (newTime.meet_day === schedTime.meet_day) {
          const newStart = parseInt(newTime.start_time);
          const newEnd = parseInt(newTime.end_time);
          const schedStart = parseInt(schedTime.start_time);
          const schedEnd = parseInt(schedTime.end_time);
          if (newStart < schedEnd && newEnd > schedStart) {
            return scheduled;
          }
        }
      }
    }
  }
  return null;
}
