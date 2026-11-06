import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  ListChecks,
  Play,
  ScanSearch,
} from "lucide-react";
import { CompactShare } from "@/components/compact-share";
import { Footer } from "@/components/footer";
import { YouTubePlayer } from "@/components/youtube-player";
import { getAllLevels, getLevelById, getLevelCover } from "@/lib/data";
import { getLevelFaqs, getVerifiedLevelGuide } from "@/lib/level-guides";
import { APP_STORE_URL, GAME_NAME, GOOGLE_PLAY_URL } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export default async function LevelDetailPage({ params }: Props) {
  const { id } = await params;
  const level = getLevelById(id);
  if (!level) notFound();

  const levels = getAllLevels();
  const currentIndex = levels.findIndex((entry) => entry.id === id);
  const previousLevel = currentIndex > 0 ? levels[currentIndex - 1] : undefined;
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  const related = levels
    .filter((entry) => entry.id !== id)
    .sort((left, right) => Math.abs(Number(left.id) - Number(id)) - Math.abs(Number(right.id) - Number(id)))
    .slice(0, 8);
  const guide = getVerifiedLevelGuide(id);
  const faqs = getLevelFaqs(id, guide);
  const cover = getLevelCover(level);
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

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-foreground sm:text-5xl">
              Rotate Rings Level {id} Walkthrough and Solution
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {guide
                ? `Use the checked bus-route notes, board images, and full video to clear Rotate Rings Level ${id}.`
                : `Watch the complete Rotate Rings Level ${id} solution and compare each route change with your board.`}
            </p>

            <div className="mt-7 flex flex-col gap-4 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>By <strong className="text-foreground">RotateRings.online Guide Team</strong> · Updated November {Number(id) >= 26 ? 4 : 3}, 2026</p>
              <CompactShare title={`Rotate Rings Level ${id} Walkthrough`} url={shareUrl} />
            </div>

            <dl className="mt-7 grid border border-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Objective", guide?.objective || "Clear every sand layer"],
                ["Key challenge", guide?.keyChallenge || "Match the full video sequence"],
                ["Guide format", guide ? "Video and board steps" : "Full video solution"],
                ["Solution source", guide ? "Gameplay video and board images" : "Complete gameplay video"],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r">
                  <dt className="text-xs font-bold uppercase text-muted-foreground">{label}</dt>
                  <dd className="mt-2 font-bold text-foreground">{value}</dd>
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
                <div className="mt-5 overflow-hidden rounded-lg border border-border bg-black shadow-sm">
                  <YouTubePlayer
                    videoId={level.videoId}
                    title={`Rotate Rings Level ${id} video walkthrough`}
                    thumbnail={`https://i.ytimg.com/vi/${level.videoId}/hqdefault.jpg`}
                  />
                </div>
              ) : null}
            </div>

            <aside aria-labelledby="related-guides">
              <h2 id="related-guides" className="text-xl font-bold text-foreground">Related Rotate Rings guides</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {related.map((entry) => (
                  <Link key={entry.id} href={`/levels/${entry.id}/`} className="group overflow-hidden rounded-md border border-border bg-card">
                    <div className="relative aspect-[6/5] bg-muted">
                      <Image
                        src={getLevelCover(entry)}
                        alt={`Rotate Rings Level ${entry.id} board`}
                        fill
                        className="object-cover transition group-hover:brightness-90"
                        sizes="150px"
                        unoptimized
                      />
                    </div>
                    <p className="px-2 py-2 text-center text-sm font-semibold text-foreground">Level {entry.id}</p>
                  </Link>
                ))}
              </div>
              <Link href="/levels/" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:border-primary hover:text-primary">
                Browse all level guides
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-4xl">

            <section className="border-l-4 border-primary bg-primary/5 p-6" aria-labelledby="quick-answer">
              <p className="text-xs font-bold uppercase text-primary">Solution summary</p>
              <h2 id="quick-answer" className="mt-2 text-2xl font-bold text-foreground">Quick Answer</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {guide?.quickAnswer || `Start Level ${id} from a clean board and follow the embedded video in order. Stop after each bus leaves and confirm that your parking spaces, open routes, and exposed sand colors still match the recording.`}
              </p>
            </section>

            {guide ? (
              <section className="mt-12" aria-labelledby="level-glance">
                <h2 id="level-glance" className="text-3xl font-bold text-foreground">Level {id} at a Glance</h2>
                <dl className="mt-6 grid border border-border sm:grid-cols-2 lg:grid-cols-4">
                  <div className="border-b border-border p-5 sm:border-r lg:border-b-0">
                    <dt className="text-xs font-bold uppercase text-muted-foreground">Initial parking slots</dt>
                    <dd className="mt-2 text-lg font-bold text-foreground">{guide.stats.parkingCapacity} spaces</dd>
                  </div>
                  <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
                    <dt className="text-xs font-bold uppercase text-muted-foreground">Verified checkpoints</dt>
                    <dd className="mt-2 text-lg font-bold text-foreground">{guide.stats.verifiedMoveCount} moves</dd>
                  </div>
                  <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
                    <dt className="text-xs font-bold uppercase text-muted-foreground">Colors in this guide</dt>
                    <dd className="mt-2 text-lg font-bold text-foreground">{guide.stats.colorCount} colors</dd>
                  </div>
                  <div className="p-5">
                    <dt className="text-xs font-bold uppercase text-muted-foreground">Full video length</dt>
                    <dd className="mt-2 text-lg font-bold text-foreground">{guide.stats.solutionDuration}</dd>
                  </div>
                  <div className="border-t border-border p-5 sm:col-span-2 lg:col-span-4">
                    <dt className="text-xs font-bold uppercase text-muted-foreground">Critical route</dt>
                    <dd className="mt-2 font-semibold leading-6 text-foreground">{guide.stats.criticalRoute}</dd>
                  </div>
                </dl>
              </section>
            ) : null}

            <section className="mt-12" aria-labelledby="overall-strategy">
              <h2 id="overall-strategy" className="text-3xl font-bold text-foreground">Overall Strategy</h2>
              <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
                {(guide?.overallStrategy || [
                  "Treat the video as the source of truth for this board. A different bus choice can change the parking state and routes available later.",
                  "Keep the same parking and sand state as the recording after each major move. If your board differs, restart instead of continuing from an unchecked route order.",
                ]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>

            <section className="mt-12" aria-labelledby="starting-board">
              <h2 id="starting-board" className="text-3xl font-bold text-foreground">Starting Board</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,600px)_1fr] md:items-start">
                <div className="relative aspect-[6/5] overflow-hidden rounded-lg border border-border bg-muted">
                  <Image src={cover} alt={`Rotate Rings Level ${id} starting board`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" unoptimized />
                </div>
                <p className="leading-7 text-muted-foreground">
                  {guide?.startingBoard || "Reset the level before comparing this image. Game updates can replace or renumber a board, so use the screenshot finder if the layout on your device is different."}
                </p>
              </div>
            </section>

            {guide ? (
              <section className="mt-14" aria-labelledby="move-checkpoints">
                <h2 id="move-checkpoints" className="text-3xl font-bold text-foreground">Verified Action Checkpoints</h2>
                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                  {guide.positionSystem === 'full-frame'
                    ? 'Positions use x/y percentages of the complete portrait screen, measured from its top-left corner.'
                    : 'Positions use the complete portrait screen. Rows run from top to bottom, columns run from left to right, and x/y values are percentages of the full image.'}
                </p>
                <div className="mt-6 overflow-x-auto border border-border">
                  <table className="w-full min-w-[820px] table-fixed text-left text-sm">
                    <caption className="sr-only">Verified vehicle positions and moves for Rotate Rings Level {id}</caption>
                    <thead className="bg-muted/60 text-foreground">
                      <tr>
                        <th scope="col" className="w-14 px-3 py-3 font-bold">Move</th>
                        <th scope="col" className="w-28 px-3 py-3 font-bold">Vehicle</th>
                        <th scope="col" className="w-44 px-3 py-3 font-bold">Position</th>
                        <th scope="col" className="w-64 px-3 py-3 font-bold">Action and purpose</th>
                        <th scope="col" className="w-56 px-3 py-3 font-bold">Parking check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {guide.moveCheckpoints.map((move) => (
                        <tr key={move.order} className="align-top">
                          <td className="px-3 py-4 font-bold text-primary">{move.order}</td>
                          <td className="px-3 py-4 font-semibold capitalize text-foreground">{move.vehicle}</td>
                          <td className="px-3 py-4 leading-6 text-muted-foreground">
                            {guide.positionSystem !== 'full-frame' ? <span className="block font-semibold capitalize text-foreground">Row {move.row}, column {move.column}</span> : null}
                            <span className="block capitalize">{move.region}</span>
                            <span className="block">x {move.xPercent}% · y {move.yPercent}%</span>
                          </td>
                          <td className="px-3 py-4 leading-6 text-muted-foreground">
                            <span className="mb-1 block font-semibold capitalize text-foreground">Move {move.direction.replace("-", " ")}</span>
                            {move.precondition ? <p className="mb-2"><strong>Before: </strong>{move.precondition}</p> : null}
                            {move.instruction ? <p className="mb-2">{move.instruction}</p> : null}
                            {move.result ? <p className="mb-2"><strong>Result: </strong>{move.result}</p> : null}
                            {move.purpose}
                            {move.risk ? <p className="mt-2"><strong>Avoid: </strong>{move.risk}</p> : null}
                          </td>
                          <td className="px-3 py-4 leading-6 text-muted-foreground">{move.parkingCheck}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {guide ? (
              <section className="mt-14" aria-labelledby="board-phases">
                <h2 id="board-phases" className="text-3xl font-bold text-foreground">Board State by Phase</h2>
                <div className="mt-6 overflow-x-auto border border-border">
                  <table className="min-w-[760px] table-fixed text-left text-sm">
                    <caption className="sr-only">Board and parking checks for each Level {id} solution phase</caption>
                    <thead className="bg-muted/60 text-foreground">
                      <tr>
                        <th scope="col" className="w-56 px-4 py-3 font-bold">Phase</th>
                        <th scope="col" className="w-36 px-4 py-3 font-bold">Checkpoints</th>
                        <th scope="col" className="w-80 px-4 py-3 font-bold">Expected board state</th>
                        <th scope="col" className="w-64 px-4 py-3 font-bold">Parking rule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {guide.phaseMetrics.map((phase) => (
                        <tr key={phase.phase} className="align-top">
                          <th scope="row" className="px-4 py-4 font-semibold text-foreground">{phase.phase}</th>
                          <td className="px-4 py-4 text-muted-foreground">{phase.moveRange}</td>
                          <td className="px-4 py-4 leading-6 text-muted-foreground">{phase.boardState}</td>
                          <td className="px-4 py-4 leading-6 text-muted-foreground">{phase.parkingRule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}


            <section className="mt-14" aria-labelledby="step-solution">
              <h2 id="step-solution" className="text-3xl font-bold text-foreground">{Number(id) >= 26 ? "Board Progress" : "Step-by-Step Solution"}</h2>
              {guide ? (
                <div className="mt-7 divide-y divide-border border-y border-border">
                  {guide.steps.map((step, index) => (
                    <section key={step.title} className={`grid gap-6 py-8 ${step.image ? "md:grid-cols-[minmax(0,1fr)_280px]" : ""} md:items-start`}>
                      <div>
                        <p className="text-xs font-bold uppercase text-primary">Step {index + 1}</p>
                        <h3 className="mt-2 text-xl font-bold text-foreground">{step.title}</h3>
                        <p className="mt-3 leading-7 text-muted-foreground">{step.instruction}</p>
                      </div>
                      {step.image ? (
                        <Image src={step.image} alt={step.imageAlt || `${step.title} in Rotate Rings Level ${id}`} width={720} height={1280} className="h-auto w-full rounded-md border border-border" unoptimized />
                      ) : null}
                    </section>
                  ))}
                </div>
              ) : (
                <div className="mt-6 border border-border bg-muted/20 p-6">
                  <p className="leading-7 text-muted-foreground">
                    Use the full walkthrough above for Level {id}. This page omits colors, bus positions, and route claims that are not visible in the source video.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-14 border-y border-border py-8" aria-labelledby="before-move">
              <div className="flex items-start gap-4">
                <ListChecks className="mt-1 h-6 w-6 flex-none text-primary" aria-hidden="true" />
                <div>
                  <h2 id="before-move" className="text-2xl font-bold text-foreground">Before Each Move</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(guide?.beforeMove || [
                      "Your board still matches the video.",
                      "A parking space is available for the selected bus.",
                      "The bus has a complete route to the road.",
                      "Matching sand is exposed on the board.",
                    ]).map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-14 border-l-4 border-amber-500 bg-amber-50 p-6 dark:bg-amber-950/20" aria-labelledby="stuck-point">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-6 w-6 flex-none text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <div>
                  <h2 id="stuck-point" className="text-2xl font-bold text-foreground">Where Players Get Stuck</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {guide?.stuckPoint || "The common failure is continuing after the parking order no longer matches the walkthrough. Restart from the opening board and compare every bus route instead of trying to recover from a different queue state."}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-14" aria-labelledby="level-faq">
              <h2 id="level-faq" className="text-3xl font-bold text-foreground">Rotate Rings Level {id} FAQ</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {faqs.map((faq) => (
                  <div key={faq.question} className="py-6">
                    <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <nav aria-label="Level navigation" className="mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-3 sm:items-center">
              {previousLevel ? (
                <Link href={`/levels/${previousLevel.id}/`} className="inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary">
                  <ArrowLeft className="h-4 w-4" /> Level {previousLevel.id}
                </Link>
              ) : <span />}
              <Link href="/levels/" className="text-center font-bold text-foreground hover:text-primary">Browse all level guides</Link>
              {nextLevel ? (
                <Link href={`/levels/${nextLevel.id}/`} className="inline-flex items-center justify-end gap-2 font-bold text-primary">
                  Level {nextLevel.id} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : <span />}
            </nav>

            <section className="mt-12 grid gap-4 border border-border bg-card p-6 sm:grid-cols-2">
              <a href="/find-level/" className="flex items-center gap-3 font-bold text-foreground hover:text-primary">
                <ScanSearch className="h-5 w-5 text-primary" /> Find a level by screenshot
              </a>
              <Link href="/download/" className="flex items-center gap-3 font-bold text-foreground hover:text-primary">
                <Download className="h-5 w-5 text-primary" /> Download {GAME_NAME}
              </Link>
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
