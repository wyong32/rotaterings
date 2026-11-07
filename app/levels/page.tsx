import Link from "next/link";
import Script from "next/script";
import { ArrowRight, BookOpen, ScanSearch } from "lucide-react";
import { Footer } from "@/components/footer";
import { LevelLibrary } from "@/components/level/level-library";
import { getAllLevels } from "@/lib/data";
import { getVerifiedLevelGuide } from "@/lib/level-guides";
import { levelPath, TARGET_LEVEL_COUNT } from "@/lib/level-paths";
import { deriveLevelDifficulty } from "@/lib/level-utils";
import { canonical } from "@/lib/site";

const rangeGuides = [
  {
    range: "1-30",
    title: "Levels 1-30: learn openings and single connections",
    copy: "The opening range establishes the visual rules. Early boards use a small number of C-rings and show how a gap must face the exact crossing before a piece separates. The sequence then introduces triangular supports, two-link centers, closed loops, and the first rigid rails. These levels are useful for learning the difference between rotating a ring and sliding a support. They also show why an obvious center piece is often not the correct opener. Compare the complete board after each release and confirm that one branch has actually disappeared before moving again.",
  },
  {
    range: "31-99",
    title: "Levels 31-99: read branches before committing",
    copy: "This range is reserved for verified boards that require more planning than the tutorials. Expect wider chains, repeated colors, and pieces that visually overlap even when they do not share the same movement rule. A safe solution should identify the branch with the fewest active links, remove the exposed outer support, and then re-evaluate the center. The guide grid will show only boards for which the opening state, move order, and completion state have been checked. An empty filter means the evidence is not ready; it does not mean the numbered level is impossible or removed from the game.",
  },
  {
    range: "100-200",
    title: "Levels 100-200: priority guides for denser boards",
    copy: "The publication queue prioritizes this middle and later range. These levels are more likely to be the point where a player needs a precise route rather than a general reminder to align a gap. The guide for each published board will record ring coordinates, opening angles, link counts, supports, clamps, verified moves, and common wrong starts. Because updates can change the number attached to a board, this range is not filled with placeholders. A page appears only after its source, images, and solution facts agree. Use the screenshot finder when your displayed number does not match the published opening image.",
  },
  {
    range: "201-260",
    title: "Levels 201-260: advanced layouts and late-stage variations",
    copy: "The final planned range covers the remaining target library after the priority boards and early foundation are established. Late-stage numbering does not automatically prove that every board is harder, so difficulty is derived from visible constraints: verified move count, supports, clamps, and the highest linked-point count on a ring. Some boards can be short but restrictive; others can contain many pieces with several clean exits. The library labels only the facts present in the checked configuration. It does not claim that Level 260 is the last level in the mobile game or that every future update will retain the same order.",
  },
];

export default function LevelsPage() {
  const sourceLevels = getAllLevels();
  const levels = sourceLevels.map((level) => {
    const guide = getVerifiedLevelGuide(level.id);
    return guide ? { ...level, difficulty: deriveLevelDifficulty(guide) } : level;
  });
  const moveCounts = Object.fromEntries(
    levels.map((level) => [level.id, getVerifiedLevelGuide(level.id)?.stats.verifiedMoveCount ?? 0]),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical("/levels/")}#collection`,
        name: "Rotate Rings Levels 1-260 Walkthroughs",
        url: canonical("/levels/"),
        description: `A verified library of ${levels.length} published Rotate Rings walkthroughs within the planned 1-${TARGET_LEVEL_COUNT} range.`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: levels.length,
          itemListElement: levels.map((level, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: level.title,
            url: canonical(levelPath(level.id)),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonical() },
          { "@type": "ListItem", position: 2, name: "Levels", item: canonical("/levels/") },
        ],
      },
    ],
  };

  return (
    <div>
      <Script id="levels-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} strategy="beforeInteractive" />
      <header className="border-b border-border bg-[#eaf8fb]">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Verified level library</p>
          <h1 className="mt-3 text-4xl font-bold text-[#17313a] sm:text-5xl">Rotate Rings Levels 1-260 Walkthroughs</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#435f68]">This library tracks a planned range of {TARGET_LEVEL_COUNT} numbered guides while linking only the {levels.length} boards that are currently verified. Every published page includes a complete opening image, measurable board data, a removal order, step images, common mistakes, and source notes.</p>
        </div>
      </header>

      <div>
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <LevelLibrary levels={levels} moveCounts={moveCounts} />
        </div>

        <section className="border-y border-border bg-[#fff7ed] py-14" aria-labelledby="range-guide-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase text-primary">How the library is organized</p>
              <h2 id="range-guide-heading" className="mt-2 text-3xl font-bold sm:text-4xl">Four level ranges, one verified record for each board</h2>
              <p className="mt-4 leading-7 text-muted-foreground">The ranges describe how the guide library is published, not a promise that every number is already available. Missing numbers remain unlinked until the source and images are complete.</p>
            </div>
            <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-2">
              {rangeGuides.map((item) => (
                <article key={item.range} className="border-t border-border pt-6">
                  <p className="text-sm font-bold text-primary">Levels {item.range}</p>
                  <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background py-14" aria-labelledby="changed-order-heading">
          <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-sm font-bold uppercase text-[#0b7285]">Do not rely on the number alone</p>
              <h2 id="changed-order-heading" className="mt-2 text-3xl font-bold sm:text-4xl">Has the level order changed?</h2>
              <div className="mt-5 max-w-3xl space-y-4 leading-7 text-muted-foreground">
                <p>A game release can insert a new tutorial, move an existing board, or present a different sequence to another group of players. The same number can then refer to more than one layout across versions. Start by comparing the opening image, not by copying the first move from a page whose geometry is different.</p>
                <p>Count rings, straight rails, rectangular frames, and clamps separately. Match the center shape, repeated colors, opening directions, and branches with multiple links. If those facts agree, the removal order remains useful even when your current number differs. If they do not agree, use Find Level and compare your screenshot with the local opening-board index.</p>
                <p>The finder performs the visual comparison in your browser. It does not upload the screenshot to this site. Results are suggestions, so open the closest guide and confirm the complete board before following its steps.</p>
              </div>
            </div>
            <aside className="border-l-4 border-[#0b7285] bg-[#eaf8fb] p-6">
              <ScanSearch className="h-8 w-8 text-[#0b7285]" />
              <h3 className="mt-4 text-2xl font-bold">Match the board instead</h3>
              <p className="mt-3 leading-7 text-muted-foreground">Paste, upload, or drop a complete opening-board screenshot. Compare the returned covers, then open the guide whose pieces and positions match.</p>
              <Link href="/find-level/" className="mt-5 inline-flex items-center gap-2 font-bold text-primary hover:underline">Open Find Level <ArrowRight className="h-4 w-4" /></Link>
            </aside>
          </div>
        </section>

        <section className="bg-muted/30 py-14" aria-labelledby="library-method-heading">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="library-method-heading" className="text-3xl font-bold">How to use a published walkthrough</h2>
            <div className="mt-6 space-y-5 leading-7 text-muted-foreground">
              <p>First, verify the opening board. The cover image is a compact view for scanning the library; the guide page contains portrait images that preserve the full interface. Confirm the positions and openings before reading the answer. A matching color palette is not enough when two boards arrange the same colors in different branches.</p>
              <p>Second, read the quick answer and removal-order table. The table names the piece, color, board position, required action, and expected result. Follow one row at a time. After a release, compare the next image or the written board state. If the selected piece stays attached, stop and check the gap angle or a support that still crosses the exit.</p>
              <p>Third, use the common-mistakes section when your move looks reasonable but does not work. Those notes describe a specific wrong action and its consequence for that board. They are not generic warnings copied across every level. The difficulty label is also based on the checked configuration rather than the level number alone.</p>
              <p>Finally, move to the nearest published previous or next guide, return to this hub, or open the screenshot finder. The site intentionally avoids unavailable links. Missing numbers are added only when the complete source, board facts, images, and written route pass the same checks as the existing guides.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-14" aria-labelledby="level-guide-links-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h2 id="level-guide-links-heading" className="mt-4 text-3xl font-bold">Guides for solving and matching boards</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["/guides/how-to-play/", "How to play Rotate Rings"],
                ["/guides/tips/", "Removal-order tips"],
                ["/guides/level-numbers-changed/", "Why level numbers change"],
                ["/guides/where-to-play/", "Where to play safely"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="border-t-4 border-primary pt-4 text-lg font-bold text-primary hover:underline">{label} <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
