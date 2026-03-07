import { useState, useEffect } from "react";
import { getDepartments } from "../api.ts";
import type { Department } from "../types.ts";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDepartments()
      .then((data) => {
        if (!cancelled) setDepartments(data.departments);
      })
      .catch((e) => console.error("Failed to load departments:", e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { departments, loading };
}
