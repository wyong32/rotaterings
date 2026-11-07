import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getGuideBySlug, guides } from "@/data/guides";
import { canonical, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  const url = canonical(`/guides/${slug}/`);
  return {
    title: guide.title,
    description: guide.description,
    authors: [{ name: "RotateRings.online Guide Team" }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: guide.title,
      description: guide.description,
      publishedTime: new Date(`${guide.publishedAt}T00:00:00+08:00`).toISOString(),
      modifiedTime: new Date(`${guide.modifiedAt}T00:00:00+08:00`).toISOString(),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: [OG_IMAGE] },
  };
}

export default async function GuideLayout({ params, children }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const url = canonical(`/guides/${slug}/`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        image: `${SITE_URL}${OG_IMAGE}`,
        datePublished: guide.publishedAt,
        dateModified: guide.modifiedAt,
        author: { "@type": "Organization", name: "RotateRings.online Guide Team", url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonical("/") },
          { "@type": "ListItem", position: 2, name: "Guides", item: canonical("/guides/") },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Script id={`guide-${slug}-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} strategy="beforeInteractive" />
      {children}
    </>
  );
}
