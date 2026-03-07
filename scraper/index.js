const res = await fetch("https://classes.colorado.edu/api/?page=fose&route=search", {
  credentials: "include",
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
    Priority: "u=0"
  },
  referrer: "https://classes.colorado.edu/",
  body: encodeURIComponent(JSON.stringify({ other: { srcdb: "2267" }, criteria: [] })),
  method: "POST",
  mode: "cors"
}).then(res => res.json());

import { writeFile } from "fs/promises";

await writeFile("classes.json", JSON.stringify(res));
