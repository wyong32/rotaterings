"use client";

import { useMemo, useState } from "react";
import { LevelCard } from "@/components/level/level-card";
import { levelPath } from "@/lib/level-paths";
import type { Level } from "@/types";

const ranges = [
  { id: "all", label: "All published", start: 1, end: 260 },
  { id: "1-30", label: "Levels 1-30", start: 1, end: 30 },
  { id: "31-99", label: "Levels 31-99", start: 31, end: 99 },
  { id: "100-200", label: "Levels 100-200", start: 100, end: 200 },
  { id: "201-260", label: "Levels 201-260", start: 201, end: 260 },
];

interface LevelLibraryProps {
  levels: Level[];
  moveCounts: Record<string, number>;
}

export function LevelLibrary({ levels, moveCounts }: LevelLibraryProps) {
  const [selectedRange, setSelectedRange] = useState("all");
  const selected = ranges.find((range) => range.id === selectedRange) ?? ranges[0];
  const filteredLevels = useMemo(
    () => levels.filter((level) => Number(level.id) >= selected.start && Number(level.id) <= selected.end),
    [levels, selected.end, selected.start],
  );

  return (
    <section aria-labelledby="published-levels-heading">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="published-levels-heading" className="text-3xl font-bold">Published walkthroughs</h2>
          <p className="mt-2 text-muted-foreground">{levels.length} verified guides are available. Filters never create links for unpublished levels.</p>
        </div>
        <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">Showing {filteredLevels.length} guides</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter published guides by level range">
        {ranges.map((range) => (
          <button key={range.id} type="button" onClick={() => setSelectedRange(range.id)} aria-pressed={selectedRange === range.id} className={`h-10 border px-3 text-sm font-bold ${selectedRange === range.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
            {range.label}
          </button>
        ))}
      </div>

      {filteredLevels.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredLevels.map((level) => (
            <LevelCard key={levelPath(level.id)} level={level} verifiedMoveCount={moveCounts[level.id]} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border-y border-border py-12 text-center">
          <p className="font-semibold">No verified guides are published in this range yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Use the screenshot finder or choose another range. Unverified numbers are not linked.</p>
        </div>
      )}
    </section>
  );
}
