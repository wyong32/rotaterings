export const SITE_URL = "https://rotaterings.online";
export const SITE_NAME = "RotateRings.online";
export const GAME_NAME = "Rotate Rings";
export const GAME_DEVELOPER = "Nebula Studio";
export const APP_STORE_URL = "https://apps.apple.com/us/app/rotate-rings/id6793924927";
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.nebula.rotaterings";
export const DOWNLOAD_COUNT = "1M+";
export const RATING_VALUE = "4.8";
export const RATING_COUNT = "103000";
export const OG_IMAGE = "/images/rotate-rings-og.webp";
export const LAST_SITE_UPDATE = "2026-11-06T00:00:00+08:00";

export const gameDescription =
  "Rotate Rings is a spatial logic puzzle. Turn interlocked rings, align each opening with the correct connector, and release the shapes in a workable order.";

export const siteDescription =
  "Play Rotate Rings online and find verified walkthroughs, board screenshots, ring-order notes, video solutions, and official mobile download links.";

export const gameKeywords = [
  "Rotate Rings",
  "Rotate Rings walkthrough",
  "Rotate Rings level guide",
  "Rotate Rings solution",
  "Rotate Rings online",
  "ring puzzle game",
  "rotate circle puzzle",
  "interlocking rings puzzle",
  "spatial logic game",
  "Nebula Studio",
];

export function canonical(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const withSlash = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;
  return `${SITE_URL}${withSlash}`;
}
