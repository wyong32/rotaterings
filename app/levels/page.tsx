"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ScanSearch } from "lucide-react";
import { Footer } from "@/components/footer";
import { LevelGrid } from "@/components/level/level-grid";
import { getAllLevels } from "@/lib/data";
import { getTenLevelRanges, MAX_LEVEL, parseLevelNumber, TOTAL_GUIDES } from "@/lib/level-utils";

export default function LevelsPage() {
  const levels = getAllLevels();
  const ranges = getTenLevelRanges();
  const [selected, setSelected] = useState("1-10");
  const [start, end] = selected.split("-").map(Number);
  const filtered = levels.filter((level) => {
    const number = parseLevelNumber(level.id);
    return number >= start && number <= end;
  });

  return (
    <div>
      <header className="border-b border-border bg-[#eaf8fb]">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Published guide library</p>
          <h1 className="mt-3 text-4xl font-bold text-[#17313a] sm:text-5xl">Rotate Rings Levels 1-{MAX_LEVEL} Walkthroughs</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#435f68]">
            Browse {TOTAL_GUIDES} checked guides from Level 1 through Level {MAX_LEVEL}. Each page uses a real gameplay video, a board cover, and full-interface progress images.
          </p>
          <Link href="/find-level/" className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#79b9c4] bg-white px-4 py-2 font-bold text-[#0b7285] hover:border-[#0b7285]">
            <ScanSearch className="h-5 w-5" />Find your board by screenshot
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 sm:px-6">
        <nav aria-label="Level ranges" className="flex flex-wrap gap-3 border-b border-border pb-6">
          {ranges.map((range) => {
            const value = `${range.start}-${range.end}`;
            return (
              <button key={value} onClick={() => setSelected(value)} className={`rounded-md border px-4 py-2 text-sm font-bold ${selected === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"}`}>
                {range.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />First published November 2, 2026</div>
        <div className="mt-8"><LevelGrid levels={filtered} /></div>

        <section className="mx-auto mt-14 max-w-4xl border-t border-border pt-10">
          <h2 className="text-3xl font-bold">How to Use These Walkthroughs</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Start by comparing the opening board image with your game. Watch the video when you need the exact route order, then use the written checkpoints to confirm which sand colors and bus groups should remain. If your numbered level shows a different picture, use the screenshot finder.</p>
          <h2 className="mt-10 text-3xl font-bold">Why Some Levels May Be Missing Later</h2>
          <p className="mt-4 leading-7 text-muted-foreground">The guide library follows confirmed videos. Missing numbers are skipped until a complete source is available; the site does not create empty or guessed level pages.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
