import { Level } from "@/types";
import levelsData from "@/data/levels.json";

export function getAllLevels(): Level[] {
  return levelsData as Level[];
}

export function getLevelById(id: string): Level | undefined {
  const levels = getAllLevels();
  return levels.find((level) => level.id === id);
}

export function getLevelCover(level: Level): string {
  return level.coverImage || level.videoThumbnail || level.thumbnail || "/levels/demo.webp";
}

export function getLevelsByCategory(category: string): Level[] {
  const levels = getAllLevels();
  return levels.filter((level) => level.category === category);
}

export function searchLevels(query: string): Level[] {
  const levels = getAllLevels();
  const lowerQuery = query.toLowerCase();

  return levels.filter((level) =>
    level.id.toLowerCase().includes(lowerQuery) ||
    level.title.toLowerCase().includes(lowerQuery) ||
    level.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getCategories(): string[] {
  const levels = getAllLevels();
  const categories = levels.map((level) => level.category);
  return Array.from(new Set(categories));
}
