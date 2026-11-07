import Image from "next/image";
import { CheckCircle2, CircleOff, Move, RotateCw } from "lucide-react";

const steps = [
  {
    title: "Read every opening before you drag",
    copy: "Start at the outside of the board and locate each C-shaped gap. Then trace the exact point where that piece crosses another ring, rail, or frame. Color helps you name a piece, but color does not determine whether it can move. The useful piece is the one whose opening can reach its active connection and continue into empty space. On the Level 2 example, the upper-right cyan ring has the cleanest first path; the lower purple ring still supports both upper pieces.",
  },
  {
    title: "Rotate the gap toward the connection",
    copy: "Drag around the ring rather than pulling directly away from the board. Watch the gap move until it faces the linked point. A small angular difference can leave the solid arc touching the other piece, so stop only when the opening covers the full crossing. Release the drag after the ring has a clear path. If the piece snaps back, the gap was misaligned or another support still occupied the exit. Re-read the connection before repeating the same move.",
  },
  {
    title: "Remove exposed supports before the center",
    copy: "Center pieces often carry two, three, or four links. Moving them early changes their angle without reducing the number of constraints. Clear an outer C-ring, sliding rail, latch, or frame first. Each successful removal turns a crowded board into a simpler one and reveals which connection is now active. On boards with rigid rails, pull the rail along its open direction; do not treat it like a C-ring. On boards with clamps, clear the short latch group before rotating the large frame it holds.",
  },
  {
    title: "Confirm the new board state after each release",
    copy: "Let the animation finish, then count the remaining pieces and inspect the space created by the move. The next safe action should use that new space or remove a newly exposed link. Do not queue several guesses while the board is moving. When you follow a walkthrough, compare the complete interface after every important release, not only the color of the selected ring. Level updates can reorder numbered boards, but the geometry, opening angles, and linked positions still identify the correct solution.",
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

        <div className="mt-9 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step.title} className="border-t border-border pt-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#17313a] text-sm font-bold text-white">{index + 1}</span>
                <div><h3 className="text-xl font-bold">{step.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{step.copy}</p></div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <Image src="/images/store/rotate-rings-level-2.webp" alt="Complete Level 2 interface used to identify the first cyan ring release" width={576} height={1246} className="mx-auto h-auto w-full max-w-[280px] border border-border object-contain shadow-sm" />
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <CheckCircle2 className="h-7 w-7 text-[#0b7285]" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-bold">What a correct release looks like</h3>
              <p className="mt-3 leading-7 text-muted-foreground">The ring opening reaches the crossing point, the space beyond it is empty, and the selected piece separates completely. The remaining pieces settle into a visibly simpler arrangement. In the shown three-ring board, clearing the upper-right cyan ring removes one side of the triangular support and exposes the orange ring's route toward the lower purple link.</p>
            </div>
            <div>
              <CircleOff className="h-7 w-7 text-[#d9480f]" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-bold">What a blocked move looks like</h3>
              <p className="mt-3 leading-7 text-muted-foreground">The gap points away from the connection, a solid arc still crosses another piece, or a rail occupies the intended exit. The piece rotates but cannot leave, then returns or remains attached. The screenshot is a verified opening state, not a staged failure image. On this board, pulling the lower purple ring first leaves both upper links under tension and does not create a valid exit.</p>
            </div>
          </div>
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
