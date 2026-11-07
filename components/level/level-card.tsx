import Link from "next/link";
import Image from "next/image";
import { Level } from "@/types";
import { cn } from "@/lib/utils";
import { getLevelCover } from "@/lib/data";
import { levelPath } from "@/lib/level-paths";
import { DifficultyBadge } from "./difficulty-badge";

interface LevelCardProps {
  level: Level;
  verifiedMoveCount?: number;
  className?: string;
}

export function LevelCard({ level, verifiedMoveCount, className }: LevelCardProps) {
  return (
    <Link href={levelPath(level.id)} className={cn("group block w-full", className)}>
      <div className="relative w-full max-w-[274px] mx-auto overflow-hidden rounded-lg border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative w-full aspect-[6/5] overflow-hidden bg-[#f7e7cf]">
          <Image
            src={getLevelCover(level)}
            alt={`Rotate Rings Level ${level.id}`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        </div>

        <div className="min-h-[104px] bg-white px-3 py-3">
          <h3 className="line-clamp-2 text-center text-sm font-semibold text-[#5C4D3C] transition-colors group-hover:text-[#b93d0d] sm:text-base">
            Rotate Rings Level {level.id}
          </h3>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <DifficultyBadge difficulty={level.difficulty} className="rounded-sm" />
            {verifiedMoveCount ? <span>{verifiedMoveCount} verified moves</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
