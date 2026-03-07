import { Plus, Heart } from "lucide-react";
import type { Course } from "../types.ts";

interface Props {
  course: Course;
  conflictWith: Course | null;
  isScheduled: boolean;
  isWishlisted: boolean;
  onAdd: () => void;
  onWishlist: () => void;
}

export default function CourseCard({
  course,
  conflictWith,
  isScheduled,
  isWishlisted,
  onAdd,
  onWishlist,
}: Props) {
  const hasConflict = !!conflictWith;
  const available = course.stat === "A";

  return (
    <div
      className={`p-3 bg-white rounded-lg border border-gray-150 transition-all hover:shadow-sm ${
        hasConflict ? "opacity-60" : ""
      } ${isScheduled ? "ring-2 ring-amber-400/50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-gray-900 truncate">{course.code}</p>
            <span
              className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                available
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {available ? "Open" : "Full"}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5 truncate">{course.title}</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
        <span>
          {course.schd} {course.no}
        </span>
        <span>{course.meets || "TBA"}</span>
        <span>{course.instr || "TBA"}</span>
        {course.credits && <span>{course.credits} cr</span>}
      </div>

      {hasConflict && (
        <p className="mt-1.5 text-[11px] text-red-600 font-medium">Conflicts with {conflictWith.code}</p>
      )}

      <div className="mt-2 flex items-center gap-1.5">
        {!isScheduled && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
        {isScheduled && (
          <span className="text-[11px] text-amber-700 font-medium px-2.5 py-1">Scheduled</span>
        )}
        {!isWishlisted && !isScheduled && (
          <button
            onClick={onWishlist}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-gray-500 hover:text-rose-500 rounded-md hover:bg-rose-50 transition-colors"
          >
            <Heart className="w-3 h-3" />
          </button>
        )}
        {isWishlisted && (
          <span className="flex items-center gap-1 px-2 py-1 text-[11px] text-rose-500">
            <Heart className="w-3 h-3 fill-current" />
          </span>
        )}
      </div>
    </div>
  );
}
