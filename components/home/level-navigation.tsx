import Link from "next/link";
import { ArrowRight, BookOpen, Layers3, ScanSearch, ShieldCheck } from "lucide-react";

const guideLinks = [
  ["/guides/how-to-play/", "How to play"],
  ["/guides/tips/", "Solving tips"],
  ["/guides/level-numbers-changed/", "Why level numbers change"],
  ["/guides/where-to-play/", "Where to play"],
] as const;

export function LevelNavigation() {
  return (
    <section className="border-b border-border bg-background py-14" aria-labelledby="renumbering-heading">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-sm font-bold uppercase text-primary">Board identity matters more than the number</p>
            <h2 id="renumbering-heading" className="mt-2 text-3xl font-bold sm:text-4xl">Why Rotate Rings level numbers change after updates</h2>
            <div className="mt-5 max-w-3xl space-y-4 leading-7 text-muted-foreground">
              <p>Mobile puzzle games can add tutorial boards, move an existing puzzle into a different stage, or test a different sequence for groups of players. When that happens, a guide written for “Level 125” may still describe a real board, but your current Level 125 can show another configuration. The solution is not to rename every page from a single report. The reliable approach is to preserve the verified board record and help the player match by visible evidence.</p>
              <p>Start with the complete opening image. Count the movable rings and separate them from rails, frames, or clamps. Compare repeated colors, the shape in the center, the positions of every gap, and the branches that touch more than one piece. These details remain useful even when a numeric label changes. A matching guide should agree on the geometry before it agrees on the first move.</p>
              <p>RotateRings.online publishes new pages only when the board, step order, and completion state can be checked. Missing numbers are intentional. This prevents a large index of pages that repeat generic advice without showing how to solve a real level. The library can therefore contain gaps while a later verified range is published first.</p>
            </div>
          </div>

          <div className="space-y-7 border-l border-border pl-6">
            <div><Layers3 className="h-7 w-7 text-primary" /><h3 className="mt-3 text-xl font-bold">Use the level library</h3><p className="mt-2 leading-7 text-muted-foreground">Browse only published guides, compare move counts and difficulty, and open the exact board record available today.</p></div>
            <div><ScanSearch className="h-7 w-7 text-[#0b7285]" /><h3 className="mt-3 text-xl font-bold">Use the screenshot finder</h3><p className="mt-2 leading-7 text-muted-foreground">When the number is unreliable, match a local screenshot against the indexed opening-board images without uploading it.</p><Link href="/find-level/" className="mt-3 inline-flex items-center gap-2 font-bold text-primary hover:underline">Find a level by screenshot <ArrowRight className="h-4 w-4" /></Link></div>
            <div><ShieldCheck className="h-7 w-7 text-[#d9480f]" /><h3 className="mt-3 text-xl font-bold">Use verified steps</h3><p className="mt-2 leading-7 text-muted-foreground">Follow the stated direction, piece, and position. If your board does not show the same state after a release, stop and rematch the layout.</p></div>
            <div>
              <BookOpen className="h-7 w-7 text-[#7c3aed]" />
              <h3 className="mt-3 text-xl font-bold">Read the game guides</h3>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
                {guideLinks.map(([href, label]) => <Link key={href} href={href} className="text-primary hover:underline">{label}</Link>)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-7">
          <Link href="/levels/" className="inline-flex items-center gap-2 text-lg font-bold text-primary hover:underline">Browse all published level guides <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </div>
    </section>
  );
}
