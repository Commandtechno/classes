import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.ts";
import type { Course, SchedulerState } from "../types.ts";

const DEFAULT_STATE: SchedulerState = {
  scheduledCourses: [],
  wishlist: [],
};

export function useScheduler() {
  const [state, setState] = useLocalStorage<SchedulerState>("cu-scheduler-state", DEFAULT_STATE);

  const addCourse = useCallback(
    (course: Course) => {
      setState((prev) => {
        if (prev.scheduledCourses.some((c) => c.crn === course.crn)) return prev;
        return {
          ...prev,
          scheduledCourses: [...prev.scheduledCourses, course],
          wishlist: prev.wishlist.filter((c) => c.crn !== course.crn),
        };
      });
    },
    [setState]
  );

  const removeCourse = useCallback(
    (crn: string) => {
      setState((prev) => ({
        ...prev,
        scheduledCourses: prev.scheduledCourses.filter((c) => c.crn !== crn),
      }));
    },
    [setState]
  );

  const replaceSection = useCallback(
    (oldCrn: string, newCourse: Course) => {
      setState((prev) => ({
        ...prev,
        scheduledCourses: prev.scheduledCourses.map((c) => (c.crn === oldCrn ? newCourse : c)),
      }));
    },
    [setState]
  );

  const addToWishlist = useCallback(
    (course: Course) => {
      setState((prev) => {
        if (prev.wishlist.some((c) => c.crn === course.crn)) return prev;
        if (prev.scheduledCourses.some((c) => c.crn === course.crn)) return prev;
        return { ...prev, wishlist: [...prev.wishlist, course] };
      });
    },
    [setState]
  );

  const removeFromWishlist = useCallback(
    (crn: string) => {
      setState((prev) => ({
        ...prev,
        wishlist: prev.wishlist.filter((c) => c.crn !== crn),
      }));
    },
    [setState]
  );

  const totalCredits = state.scheduledCourses.reduce((sum, c) => {
    const n = parseFloat(c.credits);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return {
    scheduledCourses: state.scheduledCourses,
    wishlist: state.wishlist,
    addCourse,
    removeCourse,
    replaceSection,
    addToWishlist,
    removeFromWishlist,
    totalCredits,
  };
}
