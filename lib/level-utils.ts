import levelsData from "@/data/levels.json";

export type LevelRange = {
  start: number;
  end: number;
  label: string;
};

export function parseLevelNumber(levelId: string): number {
  return parseInt(levelId.replace(/\D/g, ""), 10);
}

export function formatLevelDisplay(levelId: string): string {
  return String(parseLevelNumber(levelId));
}

export const MAX_LEVEL = levelsData.reduce((max, level) => {
  const levelNumber = parseLevelNumber(level.id);
  return Number.isFinite(levelNumber) && levelNumber > max ? levelNumber : max;
}, 0);

export const TOTAL_GUIDES = levelsData.length;

export const DEFAULT_TEN_LEVEL_RANGE: LevelRange = {
  start: 1,
  end: Math.min(10, MAX_LEVEL),
  label: `Level 1-${Math.min(10, MAX_LEVEL)}`,
};

export function getTenLevelRanges(maxLevel: number = MAX_LEVEL): LevelRange[] {
  const ranges: LevelRange[] = [DEFAULT_TEN_LEVEL_RANGE];

  for (let start = 11; start <= maxLevel; start += 10) {
    const end = Math.min(start + 9, maxLevel);
    ranges.push({
      start,
      end,
      label: `Level ${start}-${end}`,
    });
  }

  return ranges;
}

export function getFiftyLevelRanges(maxLevel: number = MAX_LEVEL): LevelRange[] {
  const ranges: LevelRange[] = [];

  for (let start = 1; start <= maxLevel; start += 50) {
    const end = Math.min(start + 49, maxLevel);
    ranges.push({
      start,
      end,
      label: `Level ${start}-${end}`,
    });
  }

  return ranges;
}
