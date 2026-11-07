import { AlertTriangle } from "lucide-react";
import type { LevelGuideMistake } from "@/lib/level-guides";

interface LevelMistakesProps {
  mistakes: LevelGuideMistake[];
}

export function LevelMistakes({ mistakes }: LevelMistakesProps) {
  return (
    <section className="mt-12 border-y border-border py-8" aria-labelledby="common-mistakes">
      <div className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-amber-700" /><h2 id="common-mistakes" className="text-3xl font-bold">Common Mistakes</h2></div>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {mistakes.map((mistake) => (
          <article key={mistake.title} className="border-l-2 border-amber-500 pl-5">
            <h3 className="text-lg font-bold">{mistake.title}</h3>
            <p className="mt-3 leading-7 text-muted-foreground"><strong className="text-foreground">Wrong action:</strong> {mistake.action}</p>
            <p className="mt-2 leading-7 text-muted-foreground"><strong className="text-foreground">What happens:</strong> {mistake.consequence}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
