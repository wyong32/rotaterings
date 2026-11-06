import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Download, ListChecks, Play, ScanSearch } from "lucide-react";
import { CompactShare } from "@/components/compact-share";
import { Footer } from "@/components/footer";
import { YouTubePlayer } from "@/components/youtube-player";
import { getAllLevels, getLevelById, getLevelCover } from "@/lib/data";
import { getLevelFaqs, getVerifiedLevelGuide } from "@/lib/level-guides";
import { APP_STORE_URL, GAME_NAME, GOOGLE_PLAY_URL, LAST_SITE_UPDATE_LABEL } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export default async function LevelDetailPage({ params }: Props) {
  const { id } = await params;
  const level = getLevelById(id);
  if (!level) notFound();

  const guide = getVerifiedLevelGuide(id);
  if (!guide) notFound();

  const levels = getAllLevels();
  const currentIndex = levels.findIndex((entry) => entry.id === id);
  const previousLevel = currentIndex > 0 ? levels[currentIndex - 1] : undefined;
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  const related = levels
    .filter((entry) => entry.id !== id)
    .sort((left, right) => Math.abs(Number(left.id) - Number(id)) - Math.abs(Number(right.id) - Number(id)))
    .slice(0, 6);
  const faqs = getLevelFaqs(id, guide);
  const shareUrl = `https://rotaterings.online/levels/${id}/`;

  return (
    <div>
      <article>
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-14">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="px-2">/</span>
              <Link href="/levels/" className="hover:text-primary">Level guides</Link>
              <span className="px-2">/</span>
              <span className="text-foreground">Level {id}</span>
            </nav>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-foreground sm:text-5xl">Rotate Rings Level {id} Walkthrough and Solution</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{guide.objective} Use the board data and removal order below to check every move.</p>

            <div className="mt-7 flex flex-col gap-4 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>By <strong className="text-foreground">RotateRings.online Guide Team</strong> · Updated {LAST_SITE_UPDATE_LABEL}</p>
              <CompactShare title={`Rotate Rings Level ${id} Walkthrough`} url={shareUrl} />
            </div>

            <dl className="mt-7 grid border border-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Objective", guide.objective],
                ["Rings", String(guide.stats.ringCount)],
                ["Other pieces", `${guide.stats.supportCount} supports · ${guide.stats.clampCount} clamps`],
                ["Solution", `${guide.stats.verifiedMoveCount} removal steps`],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r">
                  <dt className="text-xs font-bold uppercase text-muted-foreground">{label}</dt>
                  <dd className="mt-2 font-bold leading-6 text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_310px]">
            <div>
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-foreground">Video Walkthrough</h2>
              </div>
              {level.videoId ? (
                <div className="mt-5 overflow-hidden border border-border bg-black shadow-sm">
                  <YouTubePlayer
                    videoId={level.videoId}
                    title={`Rotate Rings Level ${id} video walkthrough`}
                    thumbnail={getLevelCover(level)}
                    startSeconds={level.sourceStartSecond}
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-5 border border-border bg-card p-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
                  <Image src={getLevelCover(level)} alt="Rotate Rings Level 1 official configuration board reconstruction" width={600} height={500} className="h-auto w-full border border-border" priority />
                  <div>
                    <h3 className="text-xl font-bold">Level 1 source note</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">The public recording begins at in-game Level 2. This Level 1 layout is reconstructed from the official online game configuration and is labeled as a reconstruction.</p>
                    <Link href="/#play" className="mt-4 inline-flex items-center gap-2 font-bold text-primary hover:underline">Open the online game <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              )}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.sourceNote}</p>
            </div>

            <aside aria-labelledby="related-guides">
              <h2 id="related-guides" className="text-xl font-bold text-foreground">More Rotate Rings Levels</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {related.map((entry) => (
                  <Link key={entry.id} href={`/levels/${entry.id}/`} className="group overflow-hidden border border-border bg-card">
                    <div className="relative aspect-[6/5] bg-muted">
                      <Image src={getLevelCover(entry)} alt={`Rotate Rings Level ${entry.id} opening board`} fill className="object-cover transition group-hover:brightness-90" sizes="150px" unoptimized />
                    </div>
                    <p className="px-2 py-2 text-center text-sm font-semibold text-foreground">Level {entry.id}</p>
                  </Link>
                ))}
              </div>
              <Link href="/levels/" className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:border-primary hover:text-primary">All level guides <ArrowRight className="h-4 w-4" /></Link>
            </aside>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <section className="border-l-4 border-primary bg-primary/5 p-6" aria-labelledby="quick-answer">
              <p className="text-xs font-bold uppercase text-primary">Solution summary</p>
              <h2 id="quick-answer" className="mt-2 text-2xl font-bold text-foreground">Quick Answer</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{guide.quickAnswer}</p>
            </section>

            <section className="mt-12" aria-labelledby="board-data">
              <h2 id="board-data" className="text-3xl font-bold text-foreground">Opening Board Data</h2>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{guide.startingBoard} Coordinates come from the official level configuration. X increases left to right; Y decreases toward the bottom of the board.</p>
              <div className="mt-6 overflow-x-auto border border-border">
                <table className="min-w-[820px] table-fixed text-left text-sm">
                  <caption className="sr-only">Ring coordinates and starting angles for Rotate Rings Level {id}</caption>
                  <thead className="bg-muted/60 text-foreground">
                    <tr>
                      <th className="w-16 px-3 py-3">Ring</th>
                      <th className="w-28 px-3 py-3">Color</th>
                      <th className="w-36 px-3 py-3">Position</th>
                      <th className="w-28 px-3 py-3">Coordinates</th>
                      <th className="w-28 px-3 py-3">Start angle</th>
                      <th className="w-28 px-3 py-3">Gap</th>
                      <th className="w-24 px-3 py-3">Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {guide.boardData.rings.map((ring) => (
                      <tr key={ring.id}>
                        <td className="px-3 py-3 font-bold">{ring.id}</td>
                        <td className="px-3 py-3 capitalize"><span className="mr-2 inline-block h-3 w-3 border border-black/15 align-middle" style={{ backgroundColor: ring.hex }} />{ring.color}</td>
                        <td className="px-3 py-3 capitalize">{ring.position.replace("-", " ")}</td>
                        <td className="px-3 py-3 font-mono text-xs">{ring.x}, {ring.y}</td>
                        <td className="px-3 py-3">{ring.initialAngle}°</td>
                        <td className="px-3 py-3">{ring.openingDegrees}°</td>
                        <td className="px-3 py-3">{ring.linkedPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12" aria-labelledby="strategy">
              <h2 id="strategy" className="text-3xl font-bold text-foreground">Overall Strategy</h2>
              <div className="mt-5 space-y-4 leading-7 text-muted-foreground">{guide.overallStrategy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>

            <section className="mt-12" aria-labelledby="removal-order">
              <h2 id="removal-order" className="text-3xl font-bold text-foreground">Verified Removal Order</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Use the piece name and board position first. The color alone is not enough when the same color appears more than once.</p>
              <div className="mt-6 overflow-x-auto border border-border">
                <table className="min-w-[860px] table-fixed text-left text-sm">
                  <thead className="bg-muted/60 text-foreground">
                    <tr>
                      <th className="w-16 px-3 py-3">Move</th>
                      <th className="w-48 px-3 py-3">Piece</th>
                      <th className="w-32 px-3 py-3">Position</th>
                      <th className="w-80 px-3 py-3">Action</th>
                      <th className="w-64 px-3 py-3">Expected result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {guide.removalOrder.map((move) => (
                      <tr key={move.order} className="align-top">
                        <td className="px-3 py-4 font-bold">{move.order}</td>
                        <td className="px-3 py-4 font-semibold capitalize">{move.piece}</td>
                        <td className="px-3 py-4 capitalize text-muted-foreground">{move.position}</td>
                        <td className="px-3 py-4 leading-6 text-muted-foreground">{move.action}</td>
                        <td className="px-3 py-4 leading-6 text-muted-foreground">{move.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12" aria-labelledby="phases">
              <h2 id="phases" className="text-3xl font-bold text-foreground">Board State by Phase</h2>
              <div className="mt-6 overflow-x-auto border border-border">
                <table className="min-w-[760px] table-fixed text-left text-sm">
                  <thead className="bg-muted/60 text-foreground"><tr><th className="w-52 px-4 py-3">Phase</th><th className="w-32 px-4 py-3">Moves</th><th className="w-80 px-4 py-3">Pieces</th><th className="w-80 px-4 py-3">Board check</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {guide.phaseMetrics.map((phase) => <tr key={phase.phase} className="align-top"><th className="px-4 py-4">{phase.phase}</th><td className="px-4 py-4 text-muted-foreground">{phase.moveRange}</td><td className="px-4 py-4 text-muted-foreground">{phase.boardState}</td><td className="px-4 py-4 text-muted-foreground">{phase.rule}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12" aria-labelledby="step-solution">
              <h2 id="step-solution" className="text-3xl font-bold text-foreground">Step-by-Step Solution</h2>
              <div className="mt-7 divide-y divide-border border-y border-border">
                {guide.steps.map((step, index) => (
                  <section key={step.title} className="grid gap-7 py-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-start">
                    <div>
                      <p className="text-xs font-bold uppercase text-primary">Step {index + 1}</p>
                      <h3 className="mt-2 text-xl font-bold text-foreground">{step.title}</h3>
                      <p className="mt-3 leading-7 text-muted-foreground">{step.instruction}</p>
                    </div>
                    {step.image ? <Image src={step.image} alt={step.imageAlt || `${step.title} in Rotate Rings Level ${id}`} width={488} height={1080} className="h-auto w-full border border-border" unoptimized /> : null}
                  </section>
                ))}
              </div>
            </section>

            <section className="mt-12 border-y border-border py-8" aria-labelledby="before-move">
              <div className="flex items-start gap-4">
                <ListChecks className="mt-1 h-6 w-6 flex-none text-primary" aria-hidden="true" />
                <div><h2 id="before-move" className="text-2xl font-bold text-foreground">Before Each Move</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{guide.beforeMove.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />{item}</li>)}</ul></div>
              </div>
            </section>

            <section className="mt-12 border-l-4 border-amber-500 bg-amber-50 p-6 dark:bg-amber-950/20" aria-labelledby="stuck-point">
              <div className="flex items-start gap-4"><AlertTriangle className="mt-1 h-6 w-6 flex-none text-amber-700 dark:text-amber-400" /><div><h2 id="stuck-point" className="text-2xl font-bold text-foreground">Where Players Get Stuck</h2><p className="mt-3 leading-7 text-muted-foreground">{guide.stuckPoint}</p></div></div>
            </section>

            <section className="mt-12" aria-labelledby="level-faq">
              <h2 id="level-faq" className="text-3xl font-bold text-foreground">Rotate Rings Level {id} FAQ</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="text-lg font-bold text-foreground">{faq.question}</h3><p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p></div>)}</div>
            </section>

            <nav aria-label="Level navigation" className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-3 sm:items-center">
              {previousLevel ? <Link href={`/levels/${previousLevel.id}/`} className="inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Level {previousLevel.id}</Link> : <span />}
              <Link href="/levels/" className="text-center font-bold text-foreground hover:text-primary">All level guides</Link>
              {nextLevel ? <Link href={`/levels/${nextLevel.id}/`} className="inline-flex items-center justify-end gap-2 font-bold text-primary">Level {nextLevel.id} <ArrowRight className="h-4 w-4" /></Link> : <span />}
            </nav>

            <section className="mt-12 grid gap-4 border border-border bg-card p-6 sm:grid-cols-2">
              <Link href="/find-level/" className="flex items-center gap-3 font-bold text-foreground hover:text-primary"><ScanSearch className="h-5 w-5 text-primary" /> Find a level by screenshot</Link>
              <Link href="/download/" className="flex items-center gap-3 font-bold text-foreground hover:text-primary"><Download className="h-5 w-5 text-primary" /> Download {GAME_NAME}</Link>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">Official App Store page</a>
              <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">Official Google Play page</a>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
