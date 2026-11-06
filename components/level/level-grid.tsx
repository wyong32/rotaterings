import Link from "next/link";
import { Level } from "@/types";
import { formatLevelDisplay, parseLevelNumber } from "@/lib/level-utils";
import { LevelCard } from "./level-card";

interface LevelGridProps {
  levels: Level[];
  variant?: "card" | "button";
}

export function LevelGrid({ levels, variant = "card" }: LevelGridProps) {
  if (levels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No levels found.</p>
      </div>
    );
  }

  if (variant === "button") {
    // Sort levels by number
    const sortedLevels = [...levels].sort((a, b) => {
      return parseLevelNumber(a.id) - parseLevelNumber(b.id);
    });

    return (
      <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 max-w-6xl mx-auto w-full">
        {sortedLevels.map((level) => (
          <Link
            key={level.id}
            href={`/levels/${level.id}`}
            className="flex items-center justify-center h-10 sm:h-12 rounded-lg border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-semibold text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            {formatLevelDisplay(level.id)}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto w-full px-2 sm:px-0">
      {levels.map((level) => (
        <LevelCard key={level.id} level={level} />
      ))}
    </div>
  );
}
