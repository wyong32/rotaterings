import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { Footer } from "@/components/footer";
import { getGuideBySlug, guides } from "@/data/guides";
import { getLevelById } from "@/lib/data";
import { levelPath } from "@/lib/level-paths";

type Props = { params: Promise<{ slug: string }> };

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedLevels = guide.relatedLevelIds
    .map((id) => getLevelById(String(id)))
    .filter((level): level is NonNullable<typeof level> => Boolean(level));
  const relatedGuides = guides.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div>
      <article>
        <header className="border-b border-border bg-[#eaf8fb]">
          <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <Link href="/guides/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> All guides</Link>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-[#17313a] sm:text-5xl">{guide.title}</h1>
            <p className="mt-5 text-lg leading-8 text-[#435f68]">{guide.description}</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#c9e3e8] pt-5 text-sm text-[#435f68]">
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Updated {guide.modifiedAt}</span>
              <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" /> {guide.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="max-w-3xl">
            <div className="space-y-5 text-lg leading-8 text-muted-foreground">
              {guide.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            {guide.sections.map((section) => (
              <section key={section.heading} className="mt-12 border-t border-border pt-8">
                <h2 className="text-3xl font-bold text-foreground">{section.heading}</h2>
                <div className="mt-5 space-y-5 text-lg leading-8 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.items && (
                    <ul className="list-disc space-y-3 pl-6">
                      {section.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            <section className="mt-12 border-t border-border pt-8" aria-labelledby="guide-faq-heading">
              <h2 id="guide-faq-heading" className="text-3xl font-bold">Frequently asked questions</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {guide.faq.map((item) => (
                  <div key={item.question} className="py-6">
                    <h3 className="text-xl font-bold">{item.question}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="border-l-4 border-primary bg-[#fff7ed] p-5">
              <h2 className="text-lg font-bold">Solve a specific board</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the verified level library, or match a reordered puzzle with a screenshot.</p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/levels/" className="font-bold text-primary hover:underline">Browse levels</Link>
                <Link href="/find-level/" className="font-bold text-primary hover:underline">Find level by screenshot</Link>
                <Link href="/download/" className="font-bold text-primary hover:underline">Compare ways to play</Link>
              </div>
            </div>
            {relatedLevels.length > 0 && (
              <div>
                <h2 className="text-lg font-bold">Related walkthroughs</h2>
                <ul className="mt-3 divide-y divide-border border-y border-border">
                  {relatedLevels.map((level) => (
                    <li key={level.id}>
                      <Link href={levelPath(level.id)} className="flex items-center justify-between gap-3 py-3 font-semibold hover:text-primary">Rotate Rings Level {level.id}<ArrowRight className="h-4 w-4" /></Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>

      <section className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold">More Rotate Rings guides</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedGuides.map((item) => (
              <Link key={item.slug} href={`/guides/${item.slug}/`} className="border-t-4 border-primary bg-background p-5 hover:bg-card">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
