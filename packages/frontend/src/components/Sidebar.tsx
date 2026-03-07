import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Course, Department } from "../types.ts";
import SearchBar from "./SearchBar.tsx";
import FilterBar from "./FilterBar.tsx";
import CourseCard from "./CourseCard.tsx";
import ScheduleList from "./ScheduleList.tsx";
import WishlistPanel from "./WishlistPanel.tsx";
import ConflictDialog from "./ConflictDialog.tsx";
import { hasConflict } from "../utils/conflicts.ts";

interface Props {
  query: string;
  setQuery: (v: string) => void;
  filters: Record<string, string | undefined>;
  updateFilters: (f: Record<string, string | undefined>) => void;
  results: Course[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  loadMore: () => void;
  departments: Department[];
  scheduledCourses: Course[];
  wishlist: Course[];
  totalCredits: number;
  onAddCourse: (course: Course) => void;
  onRemoveCourse: (crn: string) => void;
  onReplaceSection: (oldCrn: string, newCourse: Course) => void;
  onAddToWishlist: (course: Course) => void;
  onRemoveFromWishlist: (crn: string) => void;
}

export default function Sidebar({
  query,
  setQuery,
  filters,
  updateFilters,
  results,
  loading,
  total,
  page,
  totalPages,
  loadMore,
  departments,
  scheduledCourses,
  wishlist,
  totalCredits,
  onAddCourse,
  onRemoveCourse,
  onReplaceSection,
  onAddToWishlist,
  onRemoveFromWishlist,
}: Props) {
  const [conflictState, setConflictState] = useState<{
    course: Course;
    conflictWith: Course;
  } | null>(null);

  const handleAdd = (course: Course) => {
    const conflict = hasConflict(course, scheduledCourses);
    if (conflict) {
      setConflictState({ course, conflictWith: conflict });
    } else {
      onAddCourse(course);
    }
  };

  const handleWishlistAdd = (course: Course) => {
    const conflict = hasConflict(course, scheduledCourses);
    if (conflict) {
      setConflictState({ course, conflictWith: conflict });
    } else {
      onAddCourse(course);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/70">
      <div className="p-3 space-y-2 border-b border-gray-200 bg-white/80">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar departments={departments} filters={filters} onFilterChange={updateFilters} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}

          {!loading && results.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12">
              {query || Object.values(filters).some(Boolean)
                ? "No courses found. Try adjusting your search."
                : "Search for courses to get started."}
            </p>
          )}

          {results.length > 0 && (
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider px-1">
              {total.toLocaleString()} results
            </div>
          )}

          {results.map((course) => {
            const conflict = hasConflict(course, scheduledCourses);
            const isScheduled = scheduledCourses.some((c) => c.crn === course.crn);
            const isWishlisted = wishlist.some((c) => c.crn === course.crn);
            return (
              <CourseCard
                key={course.crn}
                course={course}
                conflictWith={conflict}
                isScheduled={isScheduled}
                isWishlisted={isWishlisted}
                onAdd={() => handleAdd(course)}
                onWishlist={() => onAddToWishlist(course)}
              />
            );
          })}

          {page < totalPages && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-2.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                `Load More (${results.length} of ${total})`
              )}
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 mx-3" />

        <div className="p-3">
          <ScheduleList
            courses={scheduledCourses}
            totalCredits={totalCredits}
            onRemove={onRemoveCourse}
            onReplaceSection={onReplaceSection}
          />
        </div>

        <div className="border-t border-gray-200 mx-3" />

        <div className="p-3">
          <WishlistPanel
            items={wishlist}
            onAddToSchedule={handleWishlistAdd}
            onRemove={onRemoveFromWishlist}
          />
        </div>
      </div>

      {conflictState && (
        <ConflictDialog
          course={conflictState.course}
          conflictWith={conflictState.conflictWith}
          onConfirm={() => {
            onAddCourse(conflictState.course);
            setConflictState(null);
          }}
          onCancel={() => setConflictState(null)}
        />
      )}
    </div>
  );
}
