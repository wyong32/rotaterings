import Script from "next/script";
import Link from "next/link";
import { ScanSearch, ShieldCheck, Shuffle, SlidersHorizontal } from "lucide-react";
import { ScreenshotFinder } from "@/components/finder/screenshot-finder";
import { Footer } from "@/components/footer";
import { getAllLevels } from "@/lib/data";
import { canonical, SITE_NAME, SITE_URL } from "@/lib/site";

// FINDER_GUIDE_COPY_START
const finderGuideSections = [
  {
    heading: "Why the number can change",
    copy: "Rotate Rings level numbers are not permanent board identifiers. A game update can insert a tutorial, move an existing stage, replace one puzzle, or deliver a different sequence to another platform. Level 120 on one device can therefore show a board that an older video labels with another number. This does not automatically make the walkthrough wrong. It means you should compare the untouched opening board before following any move. Ring positions, gap directions, rails, frames, and clamps provide stronger evidence than the number shown at the top of the game.",
  },
  {
    heading: "Prepare a useful screenshot",
    copy: "Restart the puzzle and capture the complete opening state. Keep every ring, visible gap, fixed support, clamp, and board edge in the image. Do not crop tightly around only the center because outer pieces often distinguish two similar layouts. Avoid screenshots taken after several removals or rotations. Those actions change the features used for comparison. A clear portrait screenshot from the start of the level usually gives the strongest result. PNG, JPEG, and WebP files up to 12 MB are accepted, and the crop controls can isolate the board when the surrounding interface is large.",
  },
  {
    heading: "How the local comparison works",
    copy: "The tool reads the selected image in your browser and compares visual descriptors with processed opening images from published guides. It checks broad color distribution, edges, and board shape, then returns up to five candidates. Your original screenshot is not uploaded, saved, or added to the page address. The result is a shortlist, not an automatic proof. Open a candidate and confirm the ring count, coordinates, starting gaps, and non-ring objects before using its removal order. Similar colors alone are not enough because two boards can reuse the same palette with different connections.",
  },
  {
    heading: "Understand the current limits",
    copy: "The finder searches only boards that already have verified walkthroughs and processed matching images on this site. It cannot identify an unpublished level, a board hidden by a pop-up, or a heavily changed state with most pieces removed. Low confidence can also result from a narrow crop, blur, animation effects, or a screenshot that includes too much empty interface. Try the complete opening image first, then adjust the horizontal position, vertical position, and zoom. If no candidate matches the board facts, use the level library or keep the screenshot until that board is published.",
  },
  {
    heading: "Confirm the guide before making a move",
    copy: "Treat the top result as a lead. Compare the full opening image and the board-data table on the guide page. Count the rings, locate repeated colors by position, and check every rail or clamp. The first solution step should name a piece that exists in the stated coordinate and has the described exit. If those facts disagree, return to the results and inspect another candidate. When the board matches but your displayed number differs, follow the visual guide and save its canonical link. Read the level-number guide for a detailed explanation of reordering and reporting a real mismatch.",
  },
];
// FINDER_GUIDE_COPY_END

const faqs = [
  {
    question: "What kind of Rotate Rings screenshot works best?",
    answer: "Use a clear screenshot that shows the complete ring assembly. An opening-state image gives the closest match.",
  },
  {
    question: "Why does my Rotate Rings level number differ from a guide?",
    answer: "Game updates and different editions can reorder puzzles. This tool compares the ring layout instead of trusting the displayed number.",
  },
  {
    question: "Is my screenshot uploaded or saved?",
    answer: "No. The screenshot stays on your device and is processed in your browser. The site does not upload or retain the image.",
  },
  {
    question: "What should I do when every result has low confidence?",
    answer: "Adjust the crop around the board, use an earlier screenshot, or compare the five suggested covers before opening a walkthrough.",
  },
];

export default function FindLevelPage() {
  const publishedLevelCount = getAllLevels().length;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/find-level/#application`,
        name: "Rotate Rings Screenshot Level Finder",
        url: canonical("/find-level/"),
        description: "Compare a Rotate Rings board screenshot with available level guides. The image stays on the player's device.",
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and Canvas image processing",
        isAccessibleForFree: true,
        provider: { "@type": "Organization", name: SITE_NAME, url: canonical() },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/find-level/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <div>
      <Script
        id="find-level-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />

      <section className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ScanSearch className="h-5 w-5" />
              Board matching tool
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-5xl">
              Find Your Rotate Rings Level by Screenshot
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Match the ring layout in your screenshot with available Rotate Rings guides. This helps when an update changes level numbers.
            </p>
          </div>

          <div className="mt-8">
            <ScreenshotFinder />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="container mx-auto grid gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
          <div>
            <ScanSearch className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-xl font-bold text-foreground">How matching works</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The browser compares ring positions, colors, gaps, and frame shapes with verified opening images. It returns five visual candidates for you to confirm.
            </p>
          </div>
          <div>
            <Shuffle className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-xl font-bold text-foreground">Why numbers differ</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Rotate Rings updates can move the same puzzle to another number. Matching the complete ring assembly is more reliable than searching only by number.
            </p>
          </div>
          <div>
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-xl font-bold text-foreground">Private on your device</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Your screenshot stays on your device. Processing happens in the browser, and the image is not uploaded, stored, or added to the page URL.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background" aria-labelledby="finder-guide-heading">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-primary">Match the board, then verify it</p>
            <h2 id="finder-guide-heading" className="mt-2 text-3xl font-bold text-foreground">How to find the same puzzle after level numbers change</h2>
          </div>
          <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            {finderGuideSections.map((section) => (
              <article key={section.heading} className="border-t border-border pt-5">
                <h3 className="text-xl font-bold text-foreground">{section.heading}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{section.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-4 border-l-4 border-[#0b7285] bg-[#eaf8fb] p-5">
            <Link href="/levels/" className="font-bold text-primary hover:underline">Browse the verified level library</Link>
            <Link href="/guides/level-numbers-changed/" className="font-bold text-primary hover:underline">Read why level numbers change</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rotate Rings screenshot finder FAQ</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {faqs.map((faq) => (
                <article key={faq.question} className="py-5">
                  <h3 className="font-bold text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="border-l-4 border-primary bg-primary/5 p-6">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-xl font-bold text-foreground">Current coverage</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The finder currently compares your screenshot with {publishedLevelCount} published opening boards. It does not search the full planned 1-260 library until those boards are verified and processed.
            </p>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
