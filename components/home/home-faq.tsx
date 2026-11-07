export const homeFaqs = [
  {
    question: "Why do Rotate Rings level numbers change?",
    answer: "A game update can insert, remove, or reorder boards, so the same ring layout may appear under a different number. Compare the complete opening board before following a guide. The screenshot finder matches geometry and colors rather than assuming that the displayed number is permanent.",
  },
  {
    question: "What should I move first in Rotate Rings?",
    answer: "Start with an outer piece that has a visible opening, one active connection, and empty space beyond that connection. Avoid a center ring with several linked points unless the verified solution identifies it as the opener. Rails and short latches may need to slide before a nearby ring can rotate free.",
  },
  {
    question: "Why does a ring rotate but not come off?",
    answer: "The gap may be close to the connection without fully covering it, or another ring, rail, frame, or clamp may still cross the exit. Stop repeating the same drag. Check the solid arc around the gap, then trace the space the piece must pass through after the connection clears.",
  },
  {
    question: "How many moves does a Rotate Rings level take?",
    answer: "There is no fixed move count for every board. A simple tutorial can finish in two or three releases, while a board with rails, clamps, and several linked rings requires more. Each published guide records a verified move count and removal order for that specific opening configuration.",
  },
  {
    question: "Can I play Rotate Rings without downloading it?",
    answer: "Yes. Use the authorized browser game embedded at the top of this page or open it in a separate tab. The App Store and Google Play links are available when you prefer a native mobile installation. Browser progress is controlled by the game provider and may not sync with a mobile app.",
  },
  {
    question: "How do I know a walkthrough matches my board?",
    answer: "Check the opening screenshot before reading the steps. Match the number of rings, the color positions, the center shape, any straight rails, and the clamp locations. If one of those details differs, search by screenshot. Do not force a removal order from a visually different configuration.",
  },
  {
    question: "Should I always remove the smallest ring first?",
    answer: "No. Size and color are visual identifiers, not movement rules. The first piece must have an opening that can reach its connection and a free path beyond it. On some boards the useful opener is a straight support, while on others it is an outer C-ring or the central piece.",
  },
  {
    question: "What information is included in each level guide?",
    answer: "A complete guide includes the opening board, piece coordinates, starting angles, opening widths, linked-point counts, the verified removal order, phase-by-phase board changes, common mistakes, the hardest transition, complete-interface images, and nearby published levels. Video-backed pages also identify the source recording without filling the article with timestamp labels.",
  },
];

export function HomeFaq() {
  return (
    <section className="bg-muted/30 py-14" aria-labelledby="home-faq">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase text-primary">Player questions</p>
        <h2 id="home-faq" className="mt-2 text-3xl font-bold sm:text-4xl">Rotate Rings FAQ</h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {homeFaqs.map((item) => <article key={item.question} className="py-6"><h3 className="text-lg font-bold">{item.question}</h3><p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p></article>)}
        </div>
      </div>
    </section>
  );
}
