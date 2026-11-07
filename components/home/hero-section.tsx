"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const gameplayImages = [
  {
    src: "/images/store/rotate-rings-level-2.webp",
    alt: "Complete Rotate Rings Level 2 game interface with three interlocked colored rings",
  },
  {
    src: "/images/store/rotate-rings-level-6.webp",
    alt: "Complete Rotate Rings Level 6 game interface with rings, rails, and clamps",
  },
  {
    src: "/images/store/rotate-rings-level-10.webp",
    alt: "Complete Rotate Rings Level 10 game interface with an oversized circle and support frames",
  },
];

export function HeroSection() {
  const [activeGameplay, setActiveGameplay] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || carouselPaused) return;
    const interval = window.setInterval(() => {
      setActiveGameplay((current) => (current + 1) % gameplayImages.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [carouselPaused]);

  return (
    <section className="border-b border-border bg-background py-14" aria-labelledby="browser-puzzle-heading">
      <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-primary">A free ring puzzle in the browser</p>
          <h2 id="browser-puzzle-heading" className="mt-2 text-3xl font-bold sm:text-4xl">Rotate, inspect, and release each connected shape</h2>
          <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
            <p>Rotate Rings is a spatial puzzle built around open circles, rigid rails, clamps, and linked frames. A piece leaves the board only when its opening reaches the connection that holds it and the space beyond that connection is clear. Early boards teach one connection at a time. Later boards combine several links, repeated colors, closed loops, and support pieces that must slide before a ring can move.</p>
            <p>The browser version above starts immediately and does not require an application download. A typical early puzzle takes a few moves, but the number alone does not show the real difficulty. A board with four pieces can be harder than a board with nine when clamps or closed centers restrict the available exits. Use the complete interface images beside this text to compare the scale and variety of published layouts.</p>
            <p>This site records only boards that can be checked against a complete run or the authorized game configuration. Each published guide identifies the opening coordinates, initial ring angles, link counts, removal order, difficult transition, and visible completion state. It does not create a page for a level until those facts and the accompanying images are available.</p>
          </div>
        </div>

        <div
          className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-3"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onFocusCapture={() => setCarouselPaused(true)}
          onBlurCapture={() => setCarouselPaused(false)}
        >
          <div className="relative aspect-[576/1246] w-full max-w-[250px] overflow-hidden border border-[#9fcbd3] bg-white shadow-sm sm:max-w-[280px]" role="region" aria-label="Rotate Rings gameplay screenshots">
            {gameplayImages.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 250px, 280px"
                className={`object-contain transition-opacity duration-700 motion-reduce:transition-none ${index === activeGameplay ? "opacity-100" : "pointer-events-none opacity-0"}`}
                priority={index === 0}
                aria-hidden={index !== activeGameplay}
              />
            ))}
            <button type="button" onClick={() => setActiveGameplay((current) => (current - 1 + gameplayImages.length) % gameplayImages.length)} className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#9fcbd3] bg-white/90 text-[#17313a] shadow-sm hover:bg-white" aria-label="Previous gameplay screenshot" title="Previous screenshot">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setActiveGameplay((current) => (current + 1) % gameplayImages.length)} className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#9fcbd3] bg-white/90 text-[#17313a] shadow-sm hover:bg-white" aria-label="Next gameplay screenshot" title="Next screenshot">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Choose gameplay screenshot">
            {gameplayImages.map((image, index) => (
              <button key={image.src} type="button" onClick={() => setActiveGameplay(index)} className="inline-flex h-8 w-8 items-center justify-center" aria-label={`Show gameplay screenshot ${index + 1}`} aria-current={index === activeGameplay ? "true" : undefined}>
                <span className={`h-2.5 w-2.5 rounded-full border border-[#0b7285] ${index === activeGameplay ? "bg-[#0b7285]" : "bg-white"}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
