import type { WeekendGuide } from "../schema";
import july182026 from "./2026-07-18";

const weekends = [july182026] satisfies WeekendGuide[];
const currentWeekendSlug = "2026-07-18";

export function getAllWeekends(): WeekendGuide[] {
  return weekends;
}

export function getCurrentWeekend(): WeekendGuide {
  const weekend = weekends.find((entry) => entry.slug === currentWeekendSlug);

  if (!weekend) {
    throw new Error(`Current weekend "${currentWeekendSlug}" is not registered.`);
  }

  return weekend;
}

export function getWeekendBySlug(slug: string): WeekendGuide | undefined {
  return weekends.find((entry) => entry.slug === slug);
}
