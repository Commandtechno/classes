import { buildings } from "./buildingData.js";

const classLocationCache = new Map<string, string | null>();

export async function getClassLocationId({
  code,
  crn,
  srcdb
}: {
  code: string;
  crn: string;
  srcdb: string;
}): Promise<string | null> {
  if (classLocationCache.has(crn)) return classLocationCache.get(crn)!;

  const data: any = await fetch("https://classes.colorado.edu/api/?page=fose&route=details", {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.9",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
      Referer: "https://classes.colorado.edu/"
    },
    body: encodeURIComponent(
      JSON.stringify({
        group: `code:${code}`,
        key: `crn:${crn}`,
        srcdb: srcdb,
        matched: `crn:${crn}`
      })
    ),
    method: "POST"
  }).then(res => res.json());

  const href = data.meeting_html.match(/href="([^"]+)"/)[1];
  const bldg = new URL(href).searchParams.get("bldg");
  classLocationCache.set(crn, bldg);
  return bldg;
}

const distanceCache = new Map<string, any>();

export async function calculateWalkingDistance(srcLocId: string, destLocId: string) {
  const key = [srcLocId, destLocId].join("|");
  if (distanceCache.has(key)) return distanceCache.get(key);

  const srcBldg = buildings.find(b => b.name.includes(`(${srcLocId})`));
  const destBldg = buildings.find(b => b.name.includes(`(${destLocId})`));
  if (!srcBldg || !destBldg) {
    throw new Error("building(s) not found");
  }

  const params = new URLSearchParams({
    map: "336",
    // stamp: "528GdeTf",
    fromLevel: "0",
    toLevel: "0",
    currentLevel: "0",
    toLat: srcBldg.lat.toString(),
    toLng: srcBldg.lng.toString(),
    fromLat: destBldg.lat.toString(),
    fromLng: destBldg.lng.toString(),
    mode: "walking",
    mapType: "mapboxgl",
    key: "0001085cc708b9cef47080f064612ca5"
  });

  const res: any = await fetch(`https://api.concept3d.com/wayfinding/v2?${params}`, {
    referrer: "https://map.concept3d.com/"
  }).then(res => res.json());

  const [route] = res.routes;

  const dist = {
    srcBldg,
    destBldg,
    distance: route.distance,
    duration: route.duration,
    formattedDuration: route.formattedDuration
  };

  distanceCache.set(key, dist);
  return dist;
}
