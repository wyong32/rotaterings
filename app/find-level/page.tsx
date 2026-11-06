import Script from "next/script";
import { ScanSearch, ShieldCheck, Shuffle, SlidersHorizontal } from "lucide-react";
import { ScreenshotFinder } from "@/components/finder/screenshot-finder";
import { Footer } from "@/components/footer";
import { MAX_LEVEL } from "@/lib/level-utils";
import { canonical, SITE_NAME, SITE_URL } from "@/lib/site";

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
              The finder compares screenshots with processed Levels 1-{MAX_LEVEL}. Results outside that set can be inaccurate until more verified boards are added.
            </p>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
