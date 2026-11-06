import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, Route, ShieldCheck } from "lucide-react";
import { getAllLevels } from "@/lib/data";
import { MAX_LEVEL } from "@/lib/level-utils";
import { APP_STORE_URL, GAME_DEVELOPER, GOOGLE_PLAY_URL } from "@/lib/site";
import { LevelGrid } from "@/components/level/level-grid";

const faqs = [
  ["How do you play Rotate Rings?", "Tap a bus only when its direction has an open route. The bus enters the road and collects sand of the same color. Clear every layer to finish the picture."],
  ["Why do buses get stuck?", "A bus can be blocked by another vehicle, or the parking row can fill with colors that are not currently exposed in the sand picture."],
  ["Does this site publish every level?", "The site publishes levels that have a complete source video and checked screenshots. It does not create placeholder pages for missing videos."],
  ["Why can my level number show a different picture?", "Game updates can reorder level numbers. Use Find by Screenshot to compare the opening board instead of relying only on the number."],
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
              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Each page includes the complete video, a 600×500 board image, full-interface progress screenshots, and level-specific route notes.</p>
            </div>
            <Link href="/levels/" className="inline-flex items-center gap-2 font-bold text-primary hover:underline">View all guides <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8"><LevelGrid levels={levels.slice(0, 12)} /></div>
        </div>
      </section>

      <section className="border-b border-border bg-[#fff7ed] py-14" aria-labelledby="how-to-play">
        <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
          <Image src="/images/store/gameplay-2.webp" alt="Official Rotate Rings gameplay screenshot" width={576} height={1246} className="mx-auto h-[520px] w-auto rounded-lg border border-border object-cover object-top shadow-sm" />
          <div>
            <p className="text-sm font-bold uppercase text-primary">Core rules</p>
            <h2 id="how-to-play" className="mt-2 text-3xl font-bold sm:text-4xl">How Rotate Rings Works</h2>
            <div className="mt-7 space-y-6">
              {[
                ["Read each direction", "Every bus has a direction. It must have an unobstructed route before it can reach the road."],
                ["Match the sand color", "A bus collects the same color from the visible sand layer. A wrong early color occupies parking without making progress."],
                ["Control parking capacity", "The road has limited holding spaces. Keep one open whenever the next sand color is not certain."],
                ["Expose the next layer", "Removing the current sand reveals new colors and may change which bus is useful next."],
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
              <Route className="h-8 w-8 text-primary" />
              <h2 id="strategy-guide" className="mt-4 text-2xl font-bold">Plan the Exit, Not Only the Color</h2>
              <p className="mt-3 leading-7 text-muted-foreground">A color match is useful only when the bus can reach the road. Short vehicles often need to leave before a long bus can use the same lane.</p>
            </div>
            <div>
              <ShieldCheck className="h-8 w-8 text-[#0b7285]" />
              <h2 className="mt-4 text-2xl font-bold">Keep a Recovery Space</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Do not fill every parking position with unfinished colors. One empty space lets the next exposed sand color enter without restarting.</p>
            </div>
            <div>
              <Download className="h-8 w-8 text-[#d9480f]" />
              <h2 className="mt-4 text-2xl font-bold">Official Mobile Game</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Rotate Rings is published by {GAME_DEVELOPER}. Use the official store listings for current availability and updates.</p>
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
