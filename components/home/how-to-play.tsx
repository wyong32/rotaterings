import Image from "next/image";
import { CheckCircle2, CircleOff, Move, RotateCw } from "lucide-react";

const steps = [
  {
    title: "Read every opening before you drag",
    copy: "Start at the outside of the board and locate each C-shaped gap. Then trace the exact point where that piece crosses another ring, rail, or frame. Color helps you name a piece, but color does not determine whether it can move. The useful piece is the one whose opening can reach its active connection and continue into empty space. On the Level 2 example, the upper-right cyan ring has the cleanest first path; the lower purple ring still supports both upper pieces.",
    wrongImage: "/levels/2/steps/step-1.webp",
    wrongAlt: "Level 2 board after a blocked lower-ring drag returns to the opening state",
    wrongCaption: "Wrong: pulling the lower purple ring changes nothing because both upper links still hold it.",
    correctImage: "/levels/2/steps/step-2.webp",
    correctAlt: "Level 2 board after the exposed cyan ring separates",
    correctCaption: "Correct: select the exposed upper-right cyan ring and open one side of the triangle.",
  },
  {
    title: "Rotate the gap toward the connection",
    copy: "Drag around the ring rather than pulling directly away from the board. Watch the gap move until it faces the linked point. A small angular difference can leave the solid arc touching the other piece, so stop only when the opening covers the full crossing. Release the drag after the ring has a clear path. If the piece snaps back, the gap was misaligned or another support still occupied the exit. Re-read the connection before repeating the same move.",
    wrongImage: "/levels/2/steps/step-1.webp",
    wrongAlt: "Level 2 board after a misaligned cyan-ring drag snaps back",
    wrongCaption: "Wrong: releasing before the cyan gap covers the connector returns the ring to this state.",
    correctImage: "/levels/2/steps/step-2.webp",
    correctAlt: "Level 2 cyan ring moving through the aligned opening",
    correctCaption: "Correct: the opening clears the connector and the cyan ring moves into open space.",
  },
  {
    title: "Remove exposed supports before the center",
    copy: "Center pieces often carry two, three, or four links. Moving them early changes their angle without reducing the number of constraints. Clear an outer C-ring, sliding rail, latch, or frame first. Each successful removal turns a crowded board into a simpler one and reveals which connection is now active. On boards with rigid rails, pull the rail along its open direction; do not treat it like a C-ring. On boards with clamps, clear the short latch group before rotating the large frame it holds.",
    wrongImage: "/levels/6/steps/step-1.webp",
    wrongAlt: "Level 6 board after a blocked center-piece attempt returns to the opening layout",
    wrongCaption: "Wrong: turning the crowded red-purple center first leaves the lower rigid support in place.",
    correctImage: "/levels/6/steps/step-2.webp",
    correctAlt: "Level 6 board after the exposed lower rigid support is removed",
    correctCaption: "Correct: clear the exposed lower support and create an open lane on the lower-right.",
  },
  {
    title: "Confirm the new board state after each release",
    copy: "Let the animation finish, then count the remaining pieces and inspect the space created by the move. The next safe action should use that new space or remove a newly exposed link. Do not queue several guesses while the board is moving. When you follow a walkthrough, compare the complete interface after every important release, not only the color of the selected ring. Level updates can reorder numbered boards, but the geometry, opening angles, and linked positions still identify the correct solution.",
    wrongImage: "/levels/2/steps/step-2.webp",
    wrongAlt: "Level 2 board with orange and purple pieces still connected after the first release",
    wrongCaption: "Wrong: treating the first release as completion leaves two connected pieces on the board.",
    correctImage: "/levels/2/steps/step-3.webp",
    correctAlt: "Complete Level 2 interface after every remaining connection clears",
    correctCaption: "Correct: recount the remaining pieces, clear orange and purple, then confirm the completion state.",
  },
];

export function HowToPlay() {
  return (
    <section className="border-b border-border bg-[#fff7ed] py-14" aria-labelledby="how-to-play">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-primary">Four checks before every move</p>
          <h2 id="how-to-play" className="mt-2 text-3xl font-bold sm:text-4xl">How to Play Rotate Rings</h2>
          <p className="mt-4 leading-7 text-muted-foreground">The control is simple, but a valid release depends on direction, connection, and free space. Use this sequence on every board instead of rotating the largest or brightest piece first.</p>
        </div>

        <div className="mt-9 space-y-10">
          {steps.map((step, index) => (
            <article key={step.title} className="grid gap-7 border-t border-border pt-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#17313a] text-sm font-bold text-white">{index + 1}</span>
                <div><h3 className="text-xl font-bold">{step.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{step.copy}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <figure>
                  <Image src={step.wrongImage} alt={step.wrongAlt} width={488} height={1080} className="h-auto w-full border border-border object-contain shadow-sm" />
                  <figcaption className="mt-3 flex gap-2 text-sm leading-6 text-muted-foreground"><CircleOff className="mt-0.5 h-4 w-4 flex-none text-[#d9480f]" />{step.wrongCaption}</figcaption>
                </figure>
                <figure>
                  <Image src={step.correctImage} alt={step.correctAlt} width={488} height={1080} className="h-auto w-full border border-border object-contain shadow-sm" />
                  <figcaption className="mt-3 flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#0b7285]" />{step.correctCaption}</figcaption>
                </figure>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-2"><RotateCw className="h-4 w-4 text-primary" />Rotate around the center</span>
          <span className="inline-flex items-center gap-2"><Move className="h-4 w-4 text-[#0b7285]" />Slide rigid supports along their open path</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#d9480f]" />Confirm one release before the next move</span>
        </div>
      </div>
    </section>
  );
}
