"use client";

import { useRef, useState } from "react";
import { Expand, ExternalLink, Gamepad2, RefreshCw } from "lucide-react";

const GAME_URL = "https://games.rotaterings.net/game/rotate-rings/index.html?v=20261016";

export function OnlineGame() {
  const frame = useRef<HTMLDivElement>(null);
  const [reloadKey, setReloadKey] = useState(0);

  async function enterFullScreen() {
    await frame.current?.requestFullscreen?.();
  }

  return (
    <section id="play" className="border-b border-border bg-[#fff7e6] py-14" aria-labelledby="play-heading">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Free browser game</p>
          <h2 id="play-heading" className="mt-2 text-3xl font-bold text-[#17313a] sm:text-4xl">Play Rotate Rings Online</h2>
          <p className="mt-3 leading-7 text-[#52676d]">Rotate the open loops, line each gap up with its connection, and separate every piece. Progress in this browser version is stored by the game provider.</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] border border-[#d7c5a9] bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <span className="inline-flex items-center gap-2 font-bold text-[#17313a]"><Gamepad2 className="h-5 w-5 text-[#d9480f]" /> Rotate Rings</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm font-bold hover:border-primary" title="Reload the game">
                <RefreshCw className="h-4 w-4" /> Reload
              </button>
              <button type="button" onClick={enterFullScreen} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm font-bold hover:border-primary" title="Open full screen">
                <Expand className="h-4 w-4" /> Full screen
              </button>
              <a href={GAME_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-primary px-3 py-2 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                <ExternalLink className="h-4 w-4" /> Open game
              </a>
            </div>
          </div>
          <div ref={frame} className="relative mx-auto aspect-[9/16] max-h-[760px] min-h-[560px] w-full overflow-hidden bg-black sm:min-h-[680px]">
            <iframe
              key={reloadKey}
              src={GAME_URL}
              title="Play Rotate Rings online"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">If the embedded game does not load, use Open game. The online game is hosted by games.rotaterings.net.</p>
        </div>
      </div>
    </section>
  );
}
