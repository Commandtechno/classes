import { useEffect, useState, useRef, type ReactNode } from "react";
import Walk from "./Walk";
import { ROW_HEIGHT } from "../utils/calendar";
import { generateCampusMapUrl } from "../utils/map";

interface ClassIdentifier {
  crn: string;
  code: string;
  srcdb: string;
}

interface Distance {
  distance: number;
  duration: number;
  formattedDuration: string;
  srcBldg: any;
  destBldg: any;
}

export default function WalkingDistance({
  top,
  src,
  dest,
  availableDuration
}: {
  top: number;
  src: ClassIdentifier;
  dest: ClassIdentifier;
  availableDuration: number;
}) {
  const [distance, setDistance] = useState<Distance>();

  useEffect(() => {
    fetch("/api/courses/distance", {
      method: "POST",
      body: JSON.stringify({ src, dest })
    })
      .then(res => res.json())
      .then(d => setDistance(d));
  }, []);

  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 400);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };

  if (!distance) return null;

  const extraTime = availableDuration - distance.duration / 60;

  let tooltip: ReactNode = null;
  if (showTooltip) {
    tooltip = (
      <div className="absolute z-50 left-full top-0 ml-2 w-56 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-3 text-xs text-gray-700 dark:text-gray-300 pointer-events-none">
        <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{distance.formattedDuration} walk</p>
        <div className="mt-2 space-y-0.5">
          <p>
            <span className="text-gray-500 dark:text-gray-500">From:</span> {distance.srcBldg.name}
          </p>
          <p>
            <span className="text-gray-500 dark:text-gray-500">To:</span> {distance.destBldg.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute cursor-pointer flex rounded py-0.5 text-[10px] w-full items-center justify-center gap-0.5 h-3.5 border ${extraTime < 2 ? "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400" : extraTime < 4 ? "text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400" : "border-zinc-400"}`}
      style={{ top: `${top}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() =>
        open(
          generateCampusMapUrl({
            directions: {
              type: "walking",
              from: distance.srcBldg,
              startName: distance.srcBldg.name,
              to: distance.destBldg,
              endName: distance.destBldg.name,
              ada: false
            }
          })
        )
      }
    >
      <Walk size={14} />
      {distance.formattedDuration}
      {tooltip}
    </div>
  );
}
