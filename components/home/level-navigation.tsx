import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, RotateCw, ShieldCheck } from "lucide-react";
import { getAllLevels } from "@/lib/data";
import { MAX_LEVEL } from "@/lib/level-utils";
import { APP_STORE_URL, GAME_DEVELOPER, GOOGLE_PLAY_URL } from "@/lib/site";
import { LevelGrid } from "@/components/level/level-grid";

const faqs = [
  ["How do you play Rotate Rings?", "Drag a ring to rotate its open gap toward the active connection. Release it only when the path beyond the connection is clear."],
  ["Why will a ring not come free?", "Another ring, rigid rail, or clamp still crosses its exit, or the gap is not aligned with the linked point."],
  ["Does this site publish every level?", "The site publishes levels only after the board, removal order, and completion state are checked. It does not create placeholder pages."],
  ["Why can the same number show a different puzzle?", "Game updates can reorder levels. Use Find Level to compare the opening board instead of relying only on the number."],
];

export function LevelNavigation() {
  const levels = getAllLevels();

  return (
    <>
      <section className="border-b border-border bg-background py-14" aria-labelledby="latest-guides">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-primary">Published walkthroughs</p>
              <h2 id="latest-guides" className="mt-2 text-3xl font-bold sm:text-4xl">Rotate Rings Levels 1-{MAX_LEVEL}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Each guide records the opening geometry, ring colors, initial angles, link counts, removal order, difficult move, video, and complete-interface images.</p>
            </div>
            <Link href="/levels/" className="inline-flex items-center gap-2 font-bold text-primary hover:underline">View all guides <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8"><LevelGrid levels={levels} /></div>
        </div>
      </section>

      <section className="border-b border-border bg-[#fff7ed] py-14" aria-labelledby="how-to-play">
        <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
          <Image src="/images/store/rotate-rings-level-6.webp" alt="Complete Rotate Rings game interface with rings, rails, and clamps" width={576} height={1246} className="mx-auto h-[520px] w-auto border border-border object-contain shadow-sm" />
          <div>
            <p className="text-sm font-bold uppercase text-primary">Core rules</p>
            <h2 id="how-to-play" className="mt-2 text-3xl font-bold sm:text-4xl">How Rotate Rings Works</h2>
            <div className="mt-7 space-y-6">
              {[
                ["Find the active connection", "Start from an outer ring or rail with a visible path beyond its gap."],
                ["Align the opening", "Rotate the gap toward the point where the pieces cross. The gap must pass that exact connection."],
                ["Clear supports first", "Rigid rails and clamps can hold several rings. Remove them before forcing a blocked center loop."],
                ["Confirm every release", "Let one piece separate fully before the next drag so the remaining geometry is easy to read."],
              ].map(([title, copy]) => (
                <div key={title} className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-none text-[#0b7285]" aria-hidden="true" />
                  <div><h3 className="text-lg font-bold">{title}</h3><p className="mt-1 leading-7 text-muted-foreground">{copy}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-14" aria-labelledby="strategy-guide">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <RotateCw className="h-8 w-8 text-primary" />
              <h2 id="strategy-guide" className="mt-4 text-2xl font-bold">Rotate Toward a Real Exit</h2>
              <p className="mt-3 leading-7 text-muted-foreground">A ring is not free because its gap is visible. The gap must reach the active connection, and the space on the other side must be empty.</p>
            </div>
            <div>
              <ShieldCheck className="h-8 w-8 text-[#0b7285]" />
              <h2 className="mt-4 text-2xl font-bold">Leave the Center Until Later</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Center rings often carry two or more links. Clearing exposed outside branches reduces the number of blocked connections.</p>
            </div>
            <div>
              <Download className="h-8 w-8 text-[#d9480f]" />
              <h2 className="mt-4 text-2xl font-bold">Official Mobile Game</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Rotate Rings is published by {GAME_DEVELOPER}. Use the official store listings for the current version and mobile updates.</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold"><a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">App Store</a><a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Play</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-14" aria-labelledby="home-faq">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="home-faq" className="text-3xl font-bold">Rotate Rings FAQ</h2>
          <div className="mt-7 divide-y divide-border border-y border-border">
            {faqs.map(([question, answer]) => <div key={question} className="py-6"><h3 className="text-lg font-bold">{question}</h3><p className="mt-2 leading-7 text-muted-foreground">{answer}</p></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
