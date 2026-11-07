const titlePatterns = [
  (level: number) => `Rotate Rings Level ${level} Walkthrough`,
  (level: number) => `Rotate Rings Level ${level} Solution`,
  (level: number) => `Rotate Rings Level ${level} Hints & Answer`,
  (level: number) => `Rotate Rings Level ${level} Step-by-Step`,
];

export function getLevelPageTitle(levelId: string | number): string {
  const level = Number(levelId);
  if (!Number.isInteger(level) || level < 1) throw new RangeError(`Invalid level: ${levelId}`);
  return titlePatterns[(level - 1) % titlePatterns.length](level);
}

export function getLevelPageDescription(levelId: string | number): string {
  const level = Number(levelId);
  return `Solve Rotate Rings Level ${level} with the verified opening board, ring coordinates, removal order, common mistakes, complete-interface images, and nearby guides.`;
}
