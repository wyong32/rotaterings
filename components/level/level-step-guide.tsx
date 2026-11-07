import Image from "next/image";
import type { LevelGuideStep } from "@/lib/level-guides";

interface LevelStepGuideProps {
  levelId: string;
  steps: LevelGuideStep[];
}

export function LevelStepGuide({ levelId, steps }: LevelStepGuideProps) {
  return (
    <section className="mt-12" aria-labelledby="step-solution">
      <h2 id="step-solution" className="text-3xl font-bold">Step-by-Step Solution</h2>
      <div className="mt-7 divide-y divide-border border-y border-border">
        {steps.map((step, index) => (
          <section key={step.title} className="grid gap-7 py-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-start">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{step.instruction}</p>
            </div>
            {step.image ? <Image src={step.image} alt={step.imageAlt || `${step.title} in Rotate Rings Level ${levelId}`} width={488} height={1080} className="h-auto w-full border border-border" unoptimized /> : null}
          </section>
        ))}
      </div>
    </section>
  );
}
