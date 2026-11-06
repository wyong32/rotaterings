import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLevelById, getLevelCover } from "@/lib/data";

export interface FinderMatch {
  levelId: string;
  score: number;
  confidence: "strong" | "possible" | "low";
}

interface FinderResultsProps {
  results: FinderMatch[];
  onAdjustCrop: () => void;
}

const confidenceLabels = {
  strong: "Strong match",
  possible: "Possible match",
  low: "Low confidence",
} as const;

export function FinderResults({ results, onAdjustCrop }: FinderResultsProps) {
  const lowConfidence = results.length > 0 && results[0].confidence === "low";

  return (
    <section aria-labelledby="finder-results-title" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Visual matches</p>
          <h2 id="finder-results-title" className="mt-1 text-2xl font-bold text-foreground">
            Check these level guides
          </h2>
        </div>
        {lowConfidence ? (
          <Button type="button" variant="outline" onClick={onAdjustCrop}>
            <Crop className="h-4 w-4" />
            Try another crop
          </Button>
        ) : null}
      </div>

      {lowConfidence ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          The board is not an exact match. Compare the artwork below or adjust the crop around the puzzle board.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {results.map((result) => {
          const level = getLevelById(result.levelId);
          if (!level) return null;
          return (
            <article key={result.levelId} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="relative aspect-[6/5] bg-[#f7e7cf]">
                <Image
                  src={getLevelCover(level)}
                  alt={`Rotate Rings Level ${result.levelId} board`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase text-primary">{confidenceLabels[result.confidence]}</p>
                <h3 className="mt-1 text-base font-bold text-foreground">Rotate Rings Level {result.levelId}</h3>
                <Link
                  href={`/levels/${result.levelId}/`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  View walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
