import { useState, useRef, useEffect } from "react";
import { Download, Calendar, ChevronDown } from "lucide-react";
import type { Course } from "../types.ts";
import { downloadICS, googleCalendarUrl } from "../utils/export.ts";

interface Props {
  courses: Course[];
}

export default function ExportMenu({ courses }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const disabled = courses.length === 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 py-1 z-50">
          <button
            onClick={() => {
              downloadICS(courses);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-zinc-700 flex items-center gap-2.5 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Download .ics File
          </button>
          <div className="border-t border-zinc-700 my-0.5" />
          <div className="px-3 py-2">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Individual Courses</p>
            {courses.map(c => (
              <a
                key={c.crn}
                href={googleCalendarUrl(c)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-1 py-1.5 text-xs text-gray-400 hover:text-cu-gold hover:bg-cu-gold/30 rounded transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                {c.code} ({c.schd} {c.no})
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
