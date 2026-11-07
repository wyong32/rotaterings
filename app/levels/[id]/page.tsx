import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, ListChecks, Play, ScanSearch } from "lucide-react";
import { CompactShare } from "@/components/compact-share";
import { Footer } from "@/components/footer";
import { LevelMistakes } from "@/components/level/level-mistakes";
import { LevelQuickAnswer } from "@/components/level/level-quick-answer";
import { LevelStepGuide } from "@/components/level/level-step-guide";
import { NearbyLevels } from "@/components/level/nearby-levels";
import { YouTubePlayer } from "@/components/youtube-player";
import { getAllLevels, getLevelById, getLevelCover } from "@/lib/data";
import { getLevelFaqs, getVerifiedLevelGuide } from "@/lib/level-guides";
import { getLevelPageTitle } from "@/lib/level-metadata";
import { levelPath, parseLevelSlug } from "@/lib/level-paths";
import { APP_STORE_URL, canonical, GAME_NAME, GOOGLE_PLAY_URL } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export default async function LevelDetailPage({ params }: Props) {
  const { id: slug } = await params;
  const id = parseLevelSlug(slug);
  const level = id ? getLevelById(id) : undefined;
  if (!id || !level) notFound();

  const guide = getVerifiedLevelGuide(id);
  if (!guide) notFound();

  const levels = [...getAllLevels()].sort((left, right) => Number(left.id) - Number(right.id));
  const currentIndex = levels.findIndex((entry) => entry.id === id);
  const previousLevel = currentIndex > 0 ? levels[currentIndex - 1] : undefined;
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  const nearbyLevels = levels
    .filter((entry) => entry.id !== id && entry.id !== previousLevel?.id && entry.id !== nextLevel?.id)
    .sort((left, right) => Math.abs(Number(left.id) - Number(id)) - Math.abs(Number(right.id) - Number(id)))
    .slice(0, 3);
  const faqs = getLevelFaqs(id, guide);
  const shareUrl = canonical(levelPath(id));
  const title = getLevelPageTitle(id);

  return (
    <div>
      <article>
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-14">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link><span className="px-2">/</span>
              <Link href="/levels/" className="hover:text-primary">Level guides</Link><span className="px-2">/</span>
              <span className="text-foreground">Level {id}</span>
            </nav>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{guide.objective} Use the quick answer first, then verify each move against the board data and complete-interface images.</p>

            <div className="mt-7 flex flex-col gap-4 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>By <strong className="text-foreground">RotateRings.online Guide Team</strong> · Updated {formatDate(level.modifiedAt)}</p>
              <CompactShare title={title} url={shareUrl} />
            </div>

            <dl className="mt-7 grid border border-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Objective", guide.objective],
                ["Rings", String(guide.stats.ringCount)],
                ["Other pieces", `${guide.stats.supportCount} supports · ${guide.stats.clampCount} clamps`],
                ["Solution", `${guide.stats.verifiedMoveCount} verified moves`],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r">
                  <dt className="text-xs font-bold uppercase text-muted-foreground">{label}</dt><dd className="mt-2 font-bold leading-6">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <LevelQuickAnswer answer={guide.quickAnswer} />

            <section className="mt-12" aria-labelledby="video-walkthrough">
              <div className="flex items-center gap-2"><Play className="h-5 w-5 text-primary" aria-hidden="true" /><h2 id="video-walkthrough" className="text-3xl font-bold">Video Walkthrough</h2></div>
              {level.videoId ? (
                <div className="mt-5 overflow-hidden border border-border bg-black shadow-sm"><YouTubePlayer videoId={level.videoId} title={`Rotate Rings Level ${id} video walkthrough`} thumbnail={getLevelCover(level)} startSeconds={level.sourceStartSecond} /></div>
              ) : (
                <div className="mt-5 grid gap-5 border-y border-border py-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
                  <Image src={getLevelCover(level)} alt={`Rotate Rings Level ${id} verified opening board`} width={600} height={500} className="h-auto w-full border border-border" priority />
                  <div><h3 className="text-xl font-bold">Configuration-backed guide</h3><p className="mt-3 leading-7 text-muted-foreground">No complete public recording covers this board. The geometry and images come from the authorized online game configuration, so the page labels the source instead of presenting a reconstruction as a video frame.</p><Link href="/#play" className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline">Open the online game</Link></div>
                </div>
              )}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.sourceNote}</p>
            </section>

            <section className="mt-12" aria-labelledby="board-data">
              <h2 id="board-data" className="text-3xl font-bold">Opening Board Data</h2>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{guide.startingBoard} Coordinates use the checked game configuration: X increases from left to right, and Y decreases toward the bottom.</p>
              <div className="mt-6 overflow-x-auto border border-border">
                <table className="min-w-[820px] table-fixed text-left text-sm">
                  <caption className="sr-only">Ring coordinates and starting angles for Rotate Rings Level {id}</caption>
                  <thead className="bg-muted/60"><tr><th className="w-16 px-3 py-3">Ring</th><th className="w-28 px-3 py-3">Color</th><th className="w-36 px-3 py-3">Position</th><th className="w-28 px-3 py-3">Coordinates</th><th className="w-28 px-3 py-3">Start angle</th><th className="w-28 px-3 py-3">Gap</th><th className="w-24 px-3 py-3">Links</th></tr></thead>
                  <tbody className="divide-y divide-border">{guide.boardData.rings.map((ring) => <tr key={ring.id}><td className="px-3 py-3 font-bold">{ring.id}</td><td className="px-3 py-3 capitalize"><span className="mr-2 inline-block h-3 w-3 border border-black/15 align-middle" style={{ backgroundColor: ring.hex }} />{ring.color}</td><td className="px-3 py-3 capitalize">{ring.position.replace("-", " ")}</td><td className="px-3 py-3 font-mono text-xs">{ring.x}, {ring.y}</td><td className="px-3 py-3">{ring.initialAngle}°</td><td className="px-3 py-3">{ring.openingDegrees}°</td><td className="px-3 py-3">{ring.linkedPoints}</td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section className="mt-12" aria-labelledby="strategy">
              <h2 id="strategy" className="text-3xl font-bold">Overall Strategy</h2>
              <div className="mt-5 space-y-4 leading-7 text-muted-foreground">{guide.overallStrategy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>

            <section className="mt-12" aria-labelledby="removal-order">
              <h2 id="removal-order" className="text-3xl font-bold">Verified Removal Order</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Use the piece name, direction, and board position. Color alone is not enough when the same color appears more than once.</p>
              <div className="mt-6 overflow-x-auto border border-border">
                <table className="min-w-[860px] table-fixed text-left text-sm">
                  <thead className="bg-muted/60"><tr><th className="w-16 px-3 py-3">Move</th><th className="w-48 px-3 py-3">Piece</th><th className="w-32 px-3 py-3">Position</th><th className="w-80 px-3 py-3">Action</th><th className="w-64 px-3 py-3">Expected result</th></tr></thead>
                  <tbody className="divide-y divide-border">{guide.removalOrder.map((move) => <tr key={move.order} className="align-top"><td className="px-3 py-4 font-bold">{move.order}</td><td className="px-3 py-4 font-semibold capitalize">{move.piece}</td><td className="px-3 py-4 capitalize text-muted-foreground">{move.position}</td><td className="px-3 py-4 leading-6 text-muted-foreground">{move.action}</td><td className="px-3 py-4 leading-6 text-muted-foreground">{move.result}</td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section className="mt-12" aria-labelledby="phases">
              <h2 id="phases" className="text-3xl font-bold">Board State by Phase</h2>
              <div className="mt-6 overflow-x-auto border border-border"><table className="min-w-[760px] table-fixed text-left text-sm"><thead className="bg-muted/60"><tr><th className="w-52 px-4 py-3">Phase</th><th className="w-32 px-4 py-3">Moves</th><th className="w-80 px-4 py-3">Pieces</th><th className="w-80 px-4 py-3">Board check</th></tr></thead><tbody className="divide-y divide-border">{guide.phaseMetrics.map((phase) => <tr key={phase.phase} className="align-top"><th className="px-4 py-4">{phase.phase}</th><td className="px-4 py-4 text-muted-foreground">{phase.moveRange}</td><td className="px-4 py-4 text-muted-foreground">{phase.boardState}</td><td className="px-4 py-4 text-muted-foreground">{phase.rule}</td></tr>)}</tbody></table></div>
            </section>

            <LevelStepGuide levelId={id} steps={guide.steps} />

            <section className="mt-12 border-y border-border py-8" aria-labelledby="level-challenge">
              <h2 id="level-challenge" className="text-3xl font-bold">Why Level {id} Is Difficult</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-3">
                <div><h3 className="text-lg font-bold">Difference from the previous level</h3><p className="mt-2 leading-7 text-muted-foreground">{guide.previousLevelDifference}</p></div>
                <div><h3 className="text-lg font-bold">Main constraint</h3><p className="mt-2 leading-7 text-muted-foreground">{guide.keyChallenge}</p></div>
                <div><h3 className="text-lg font-bold">Where players get stuck</h3><p className="mt-2 leading-7 text-muted-foreground">{guide.stuckPoint}</p></div>
              </div>
            </section>

            <LevelMistakes mistakes={guide.commonMistakes} />

            <section className="mt-12 border-y border-border py-8" aria-labelledby="before-move">
              <div className="flex items-start gap-4"><ListChecks className="mt-1 h-6 w-6 flex-none text-primary" aria-hidden="true" /><div><h2 id="before-move" className="text-2xl font-bold">Before Each Move</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{guide.beforeMove.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />{item}</li>)}</ul></div></div>
            </section>

            <section className="mt-12" aria-labelledby="level-faq">
              <h2 id="level-faq" className="text-3xl font-bold">Rotate Rings Level {id} FAQ</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="text-lg font-bold">{faq.question}</h3><p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p></div>)}</div>
            </section>

            <NearbyLevels previousLevel={previousLevel} nextLevel={nextLevel} nearbyLevels={nearbyLevels} />

            <section className="mt-12 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
              <Link href="/find-level/" className="flex items-center gap-3 font-bold hover:text-primary"><ScanSearch className="h-5 w-5 text-primary" />Find a level by screenshot</Link>
              <Link href="/download/" className="flex items-center gap-3 font-bold hover:text-primary"><Download className="h-5 w-5 text-primary" />Download {GAME_NAME}</Link>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">App Store listing</a>
              <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">Google Play listing</a>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
