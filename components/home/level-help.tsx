"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, ScanSearch, Search } from "lucide-react";
import { getAllLevels, getLevelById } from "@/lib/data";
import { levelPath } from "@/lib/level-paths";

const publishedLevels = getAllLevels();
const priorityLevels = publishedLevels.filter((level) => Number(level.id) >= 100 && Number(level.id) <= 200);
const fallbackIds = new Set([2, 4, 6, 8, 10]);
const quickLevels = (priorityLevels.length >= 5 ? priorityLevels : publishedLevels.filter((level) => fallbackIds.has(Number(level.id)))).slice(0, 5);

export function LevelHelp() {
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(Number.parseInt(level, 10));
    if (getLevelById(value)) {
      setError("");
      router.push(levelPath(value));
      return;
    }
    setError("That level guide has not been published yet. Try the screenshot finder or choose a verified guide below.");
  }

  return (
    <section className="border-b border-border bg-background py-14" aria-labelledby="level-help-heading">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-primary">Stuck on a specific board?</p>
            <h2 id="level-help-heading" className="mt-2 text-3xl font-bold sm:text-4xl">Find the matching Rotate Rings solution</h2>
            <div className="mt-5 max-w-3xl space-y-4 leading-7 text-muted-foreground">
              <p>Enter the level number shown in your game to open a published walkthrough. The lookup does not send you to an empty page. If the number has not been verified, the form keeps you here and offers the screenshot finder instead. Each available result includes a complete opening-board image, ring coordinates, initial angles, link counts, a removal-order table, step images, the difficult move, and the final board state.</p>
              <p>Our publication queue gives priority to Levels 100–200 because those middle and later boards are more likely to combine several rings, rails, clamps, or repeated colors. Only verified pages appear in the links below. While that priority range is being prepared, the shortcuts fall back to checked early levels so every link leads to a complete guide.</p>
            </div>

            <form onSubmit={submit} className="mt-7 flex max-w-xl gap-2" aria-label="Find a Rotate Rings level">
              <label className="sr-only" htmlFor="home-level-search">Enter a level number</label>
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input id="home-level-search" name="level" inputMode="numeric" value={level} onChange={(event) => setLevel(event.target.value.replace(/\D/g, ""))} placeholder="Enter a published level" className="h-12 w-full rounded-md border border-[#9fcbd3] bg-white pl-11 pr-3 text-base outline-none focus:border-[#0b7285] focus:ring-2 focus:ring-[#0b7285]/20" />
              </div>
              <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-md bg-[#d9480f] px-5 font-bold text-white hover:bg-[#b93d0d]">Go <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </form>
            {error ? <p className="mt-3 max-w-xl text-sm font-semibold text-[#a33b12]" role="alert">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-2" aria-label="Selected published Rotate Rings levels">
              {quickLevels.map((item) => <Link key={item.id} href={levelPath(item.id)} className="inline-flex h-10 items-center border border-border px-3 text-sm font-bold hover:border-primary hover:text-primary">Level {item.id}</Link>)}
            </div>
          </div>

          <aside className="border-l-4 border-[#0b7285] bg-[#eaf8fb] p-6" aria-labelledby="screenshot-help-heading">
            <ScanSearch className="h-8 w-8 text-[#0b7285]" aria-hidden="true" />
            <h3 id="screenshot-help-heading" className="mt-4 text-2xl font-bold">Find by Screenshot</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Updates can move the same puzzle to another number. Upload or paste a complete opening-board screenshot to compare its color layout and geometry with the local guide index. The matching runs in your browser; the image is not uploaded to this site.</p>
            <Link href="/find-level/" className="mt-5 inline-flex items-center gap-2 font-bold text-primary hover:underline">Open the screenshot finder <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
