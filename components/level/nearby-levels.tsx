import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ScanSearch } from "lucide-react";
import { levelPath } from "@/lib/level-paths";
import type { Level } from "@/types";

interface NearbyLevelsProps {
  previousLevel?: Level;
  nextLevel?: Level;
  nearbyLevels: Level[];
}

export function NearbyLevels({ previousLevel, nextLevel, nearbyLevels }: NearbyLevelsProps) {
  return (
    <section className="mt-12 border-t border-border pt-8" aria-labelledby="nearby-levels">
      <h2 id="nearby-levels" className="text-2xl font-bold">Continue with a published guide</h2>
      <nav aria-label="Nearest published levels" className="mt-5 grid gap-3 sm:grid-cols-3">
        {previousLevel ? <Link href={levelPath(previousLevel.id)} className="inline-flex min-h-12 items-center gap-2 border border-border px-4 font-bold hover:border-primary hover:text-primary"><ArrowLeft className="h-4 w-4" />Level {previousLevel.id}</Link> : <span />}
        <Link href="/levels/" className="inline-flex min-h-12 items-center justify-center border border-border px-4 text-center font-bold hover:border-primary hover:text-primary">All level guides</Link>
        {nextLevel ? <Link href={levelPath(nextLevel.id)} className="inline-flex min-h-12 items-center justify-end gap-2 border border-border px-4 font-bold hover:border-primary hover:text-primary">Level {nextLevel.id}<ArrowRight className="h-4 w-4" /></Link> : <span />}
      </nav>
      {nearbyLevels.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{nearbyLevels.map((level) => <Link key={level.id} href={levelPath(level.id)} className="border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Level {level.id}</Link>)}</div> : null}
      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
        <Link href="/guides/how-to-play/" className="inline-flex items-center gap-2 text-primary hover:underline"><BookOpen className="h-4 w-4" />How to play Rotate Rings</Link>
        <Link href="/guides/tips/" className="inline-flex items-center gap-2 text-primary hover:underline"><BookOpen className="h-4 w-4" />Rotate Rings strategy tips</Link>
        <Link href="/find-level/" className="inline-flex items-center gap-2 text-primary hover:underline"><ScanSearch className="h-4 w-4" />Find a level by screenshot</Link>
      </div>
    </section>
  );
}
