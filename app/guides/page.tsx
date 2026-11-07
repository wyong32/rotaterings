import Link from "next/link";
import { ArrowRight, BookOpen, Download, Layers3, ScanSearch } from "lucide-react";
import { Footer } from "@/components/footer";
import { guides } from "@/data/guides";

const guideLabels: Record<string, string> = {
  "how-to-play": "Rules and controls",
  tips: "Solving strategy",
  "level-numbers-changed": "Level matching",
  "where-to-play": "Platform comparison",
};

export default function GuidesPage() {
  return (
    <div>
      <header className="border-b border-border bg-[#eaf8fb]">
        <div className="container mx-auto px-4 py-14 sm:px-6">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Rotate Rings reference library</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold text-[#17313a] sm:text-5xl">Rules, Strategy, Level Matching, and Ways to Play</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#435f68]">These guides explain the mechanics that apply across many boards. Use the level library when you need a verified answer for one numbered puzzle.</p>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-14 sm:px-6" aria-labelledby="guide-list-heading">
          <h2 id="guide-list-heading" className="text-3xl font-bold">Evergreen Rotate Rings guides</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <article key={guide.slug} className="border border-border bg-card p-6">
                <p className="text-sm font-bold uppercase text-primary">{guideLabels[guide.slug]}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight">{guide.title}</h3>
                <p className="mt-4 leading-7 text-muted-foreground">{guide.description}</p>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                  <span>{guide.readingTime}</span>
                  <Link href={`/guides/${guide.slug}/`} className="inline-flex items-center gap-2 font-bold text-primary hover:underline">
                    Read guide <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-14" aria-labelledby="guide-tools-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 id="guide-tools-heading" className="text-3xl font-bold">Use the right page for the problem</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div className="border-t-4 border-primary pt-5">
                <Layers3 className="h-7 w-7 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Need one level answer?</h3>
                <p className="mt-2 leading-7 text-muted-foreground">Browse verified pages with board coordinates, removal order, images, and common mistakes.</p>
                <Link href="/levels/" className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline">Open levels <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="border-t-4 border-[#0b7285] pt-5">
                <ScanSearch className="h-7 w-7 text-[#0b7285]" />
                <h3 className="mt-3 text-xl font-bold">Number does not match?</h3>
                <p className="mt-2 leading-7 text-muted-foreground">Use a complete opening screenshot to compare your board with the published image index.</p>
                <Link href="/find-level/" className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline">Find a level <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="border-t-4 border-[#d97706] pt-5">
                <Download className="h-7 w-7 text-[#d97706]" />
                <h3 className="mt-3 text-xl font-bold">Need a platform link?</h3>
                <p className="mt-2 leading-7 text-muted-foreground">Compare the browser game with the App Store and Google Play listings.</p>
                <Link href="/download/" className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline">View play options <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-3xl font-bold">How these guides differ from the blog</h2>
          <p className="mt-5 leading-7 text-muted-foreground">The guide library contains maintained reference material: rules, strategy, level matching, and platform choices. The blog is reserved for dated game updates and site news. This separation gives each page one clear purpose and prevents an article from competing with a level walkthrough for the same query.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
