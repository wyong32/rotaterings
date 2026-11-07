"use client";

import { useRef, useState } from "react";
import { Expand, ExternalLink, Gamepad2, Play, RotateCcw } from "lucide-react";
import { ONLINE_GAME_URL } from "@/lib/site";

export function OnlineGame() {
  const frame = useRef<HTMLDivElement>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function playGame() {
    setReloadKey((key) => key + 1);
    frame.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function enterFullScreen() {
    await frame.current?.requestFullscreen?.();
  }

  return (
    <section id="play" className="border-b border-border bg-[#eaf8fb] py-8 sm:py-10" aria-labelledby="play-heading">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Play in your browser</p>
          <h1 id="play-heading" className="mt-2 text-4xl font-bold leading-tight text-[#17313a] sm:text-5xl">
            Play Rotate Rings Online <span className="block sm:inline">- Free Browser Puzzle</span>
          </h1>
          <p className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm font-semibold text-[#435f68]">
            <span>Free browser puzzle</span><span aria-hidden="true">·</span><span>No download</span><span aria-hidden="true">·</span><span>Works on mobile</span>
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-[900px] border border-[#9fcbd3] bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <span className="inline-flex items-center gap-2 font-bold text-[#17313a]"><Gamepad2 className="h-5 w-5 text-[#d9480f]" /> Rotate Rings</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={playGame} className="inline-flex h-10 items-center gap-2 bg-[#d9480f] px-4 text-sm font-bold text-white hover:bg-[#b93d0d]" title="Start or restart the game">
                <Play className="h-4 w-4" /> Play
              </button>
              <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-bold hover:border-primary" title="Reload the game">
                <RotateCcw className="h-4 w-4" /> Reload
              </button>
              <button type="button" onClick={enterFullScreen} className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-bold hover:border-primary" title="Open full screen">
                <Expand className="h-4 w-4" /> Full screen
              </button>
              <a href={ONLINE_GAME_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 border border-primary px-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                <ExternalLink className="h-4 w-4" /> Open game
              </a>
            </div>
          </div>
          <div ref={frame} className="relative mx-auto aspect-[9/16] min-h-[520px] w-full max-w-[360px] overflow-hidden bg-black sm:min-h-[620px] lg:aspect-[16/10] lg:min-h-[520px] lg:max-w-none">
            <iframe
              key={reloadKey}
              src={ONLINE_GAME_URL}
              title="Play Rotate Rings online"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Progress and availability are controlled by the game provider. If the frame does not load, use Open game to launch the same authorized browser version in a new tab.</p>
        </div>
      </div>
    </section>
  );
}
