export const TARGET_LEVEL_COUNT = 260;

function normalizeLevelNumber(levelId: string | number): number {
  const value = typeof levelId === "number" ? levelId : Number(levelId);
  if (!Number.isInteger(value) || value < 1 || value > TARGET_LEVEL_COUNT) {
    throw new RangeError(`Invalid Rotate Rings level: ${levelId}`);
  }
  return value;
}

export function levelPath(levelId: string | number): string {
  return `/levels/level-${normalizeLevelNumber(levelId)}/`;
}

export function parseLevelSlug(slug: string): string | null {
  const match = /^level-([1-9]\d*)$/.exec(slug);
  if (!match) return null;
  const level = Number(match[1]);
  return level <= TARGET_LEVEL_COUNT ? String(level) : null;
}

export function isLegacyLevelPath(pathname: string): boolean {
  const match = /^\/levels\/([1-9]\d*)\/?$/.exec(pathname);
  if (!match) return false;
  return Number(match[1]) <= TARGET_LEVEL_COUNT;
}
