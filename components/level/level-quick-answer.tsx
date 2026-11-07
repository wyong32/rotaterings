interface LevelQuickAnswerProps {
  answer: string;
}

export function LevelQuickAnswer({ answer }: LevelQuickAnswerProps) {
  return (
    <section className="border-l-4 border-primary bg-primary/5 p-6" aria-labelledby="quick-answer">
      <p className="text-xs font-bold uppercase text-primary">Use this order first</p>
      <h2 id="quick-answer" className="mt-2 text-2xl font-bold">Quick Answer</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
    </section>
  );
}
