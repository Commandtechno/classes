import type { Course } from "../types";

/** Category IDs to show on the map (e.g. building types, amenities) */
type CategoryIds = number[];

/** Walking or driving directions config */
interface DirectionsOptions {
  type: "walking" | "driving" | "biking";
  ada: boolean;
  from: { lat: number; lng: number; floorId?: number };
  to: { lat: number; lng: number; floorId?: number };
  startName: string;
  endName: string;
}

interface CampusMapOptions {
  /** Concept3D map ID (CU Boulder = 336) */
  mapId?: number;
  /** Category filter IDs shown after `#!ct/` */
  categories?: CategoryIds;
  /** If provided, appends directions query after `?d/` */
  directions?: DirectionsOptions;
  /** Base URL for the map embed */
  baseUrl?: string;
}

/**
 * Generates a Concept3D campus map embed URL.
 *
 * Output format:
 *   {baseUrl}/?id={mapId}#!ct/{cat1},{cat2},...?d/type:{type};ada:{ada};from:{lat},{lng},{floor};to:{lat},{lng},{floor};startName:{name};endName:{name}
 */
export function generateCampusMapUrl(options: CampusMapOptions): string {
  const { mapId = 336, categories = [], directions, baseUrl = "https://www.colorado.edu/map" } = options;

  let url = `${baseUrl}/?id=${mapId}#!`;

  if (categories.length > 0) {
    url += `ct/${categories.join(",")}?`;
  }

  if (directions) {
    const { type, ada, from, to, startName, endName } = directions;

    const fromStr = `${from.lat},${from.lng},${from.floorId ?? 0}`;
    const toStr = `${to.lat},${to.lng},${to.floorId ?? 0}`;

    const encodedStartName = encodeURIComponent(startName);
    const encodedEndName = encodeURIComponent(endName);

    const directionsStr = [
      `type:${type}`,
      `ada:${ada}`,
      `from:${fromStr}`,
      `to:${toStr}`,
      `startName:${encodedStartName}`,
      `endName:${encodedEndName}`
    ].join(";");

    url += `d/${directionsStr}`;
  }

  return url;
}
