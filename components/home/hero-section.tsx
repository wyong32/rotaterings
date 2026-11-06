"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, CircleDot, ScanSearch, Search, Workflow } from "lucide-react";
import { getLevelById } from "@/lib/data";
import { MAX_LEVEL } from "@/lib/level-utils";

const gameplayImages = [
  {
    src: "/images/store/rotate-rings-level-2.webp",
    alt: "Complete Rotate Rings Level 2 game interface with interlocked colored rings",
  },
  {
    src: "/images/store/rotate-rings-level-6.webp",
    alt: "Complete Rotate Rings Level 6 game interface showing a linked ring puzzle",
  },
  {
    src: "/images/store/rotate-rings-level-10.webp",
    alt: "Complete Rotate Rings Level 10 game interface showing rings, rails, and clamps",
  },
];

export function HeroSection() {
  const [level, setLevel] = useState("");
  const [activeGameplay, setActiveGameplay] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || carouselPaused) return;

    const interval = window.setInterval(() => {
      setActiveGameplay((current) => (current + 1) % gameplayImages.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [carouselPaused]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(Number.parseInt(level, 10));
    if (getLevelById(value)) router.push(`/levels/${value}/`);
  }

  return (
    <section className="border-b border-border bg-[#eaf8fb]">
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Video and screenshot walkthroughs</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-[#17313a] sm:text-6xl">Rotate Rings Level Guides</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#435f68]">
            Match your ring layout, follow the verified removal order, and compare full-interface screenshots for each published level.
          </p>

          <form onSubmit={submit} className="mt-8 flex max-w-xl gap-2" aria-label="Find a Rotate Rings level">
            <label className="sr-only" htmlFor="hero-level-search">Enter a level number</label>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="hero-level-search"
                name="level"
                inputMode="numeric"
                value={level}
                onChange={(event) => setLevel(event.target.value.replace(/\D/g, ""))}
                placeholder={`Enter level 1-${MAX_LEVEL}`}
                className="h-12 w-full rounded-md border border-[#9fcbd3] bg-white pl-11 pr-3 text-base outline-none focus:border-[#0b7285] focus:ring-2 focus:ring-[#0b7285]/20"
              />
            </div>
            <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#d9480f] px-5 font-bold text-white hover:bg-[#b93d0d]">
              Go <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#31515b]">
            <span className="inline-flex items-center gap-2"><CircleDot className="h-4 w-4 text-[#d9480f]" />10 verified guides</span>
            <span className="inline-flex items-center gap-2"><Workflow className="h-4 w-4 text-[#0b7285]" />Board-specific ring order</span>
            <Link href="/find-level/" className="inline-flex items-center gap-2 text-[#b93d0d] hover:underline">
              <ScanSearch className="h-4 w-4" aria-hidden="true" />
              Find by Screenshot when level numbers change
            </Link>
          </div>
        </div>

        <div
          className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-3"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onFocusCapture={() => setCarouselPaused(true)}
          onBlurCapture={() => setCarouselPaused(false)}
        >
          <div className="relative aspect-[576/1246] w-full max-w-[250px] overflow-hidden rounded-lg border border-[#9fcbd3] bg-white shadow-lg sm:max-w-[280px] lg:max-w-[290px]" role="region" aria-label="Rotate Rings gameplay screenshots">
            {gameplayImages.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 250px, 290px"
                className={`object-contain transition-opacity duration-700 motion-reduce:transition-none ${index === activeGameplay ? "opacity-100" : "pointer-events-none opacity-0"}`}
                priority={index === 0}
                aria-hidden={index !== activeGameplay}
              />
            ))}
            <button
              type="button"
              onClick={() => setActiveGameplay((current) => (current - 1 + gameplayImages.length) % gameplayImages.length)}
              className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#9fcbd3] bg-white/90 text-[#17313a] shadow-sm hover:bg-white"
              aria-label="Previous gameplay screenshot"
              title="Previous screenshot"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActiveGameplay((current) => (current + 1) % gameplayImages.length)}
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#9fcbd3] bg-white/90 text-[#17313a] shadow-sm hover:bg-white"
              aria-label="Next gameplay screenshot"
              title="Next screenshot"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Choose gameplay screenshot">
            {gameplayImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveGameplay(index)}
                className="inline-flex h-8 w-8 items-center justify-center"
                aria-label={`Show gameplay screenshot ${index + 1}`}
                aria-current={index === activeGameplay ? "true" : undefined}
              >
                <span className={`h-2.5 w-2.5 rounded-full border border-[#0b7285] ${index === activeGameplay ? "bg-[#0b7285]" : "bg-white"}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
