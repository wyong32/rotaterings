import type { Metadata } from "next";
import Script from "next/script";
import { getAllLevels, getLevelById, getLevelCover } from "@/lib/data";
import { getLevelFaqs, getVerifiedLevelGuide } from "@/lib/level-guides";
import { canonical, GAME_NAME, LAST_SITE_UPDATE, SITE_NAME, SITE_URL } from "@/lib/site";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

function absoluteImage(source: string) {
  return source.startsWith("http") ? source : `${SITE_URL}${source}`;
}

export async function generateStaticParams() {
  return getAllLevels().map((level) => ({ id: level.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const level = getLevelById(id);

  if (!level) {
    return {
      title: "Rotate Rings Level Not Found",
      description: "The requested Rotate Rings level guide could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const url = canonical(`/levels/${id}/`);
  const title = `Rotate Rings Level ${id} Walkthrough & Solution`;
  const description = `Solve Rotate Rings Level ${id} with the complete video walkthrough, board comparison, related levels, and checked written steps when available.`;
  const image = absoluteImage(getLevelCover(level));

  return {
    title,
    description,
    keywords: [
      `Rotate Rings Level ${id}`,
      `Rotate Rings Level ${id} walkthrough`,
      `Rotate Rings Level ${id} solution`,
      "bus traffic puzzle guide",
      "sand color matching walkthrough",
    ],
    authors: [{ name: "RotateRings.online Guide Team", url: canonical("/about-us/") }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title,
      description,
      publishedTime: LAST_SITE_UPDATE,
      modifiedTime: LAST_SITE_UPDATE,
      images: [{ url: image, width: 600, height: 500, alt: `Rotate Rings Level ${id} board and walkthrough` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function LevelLayout({ params, children }: Props) {
  const { id } = await params;
  const level = getLevelById(id);
  if (!level) return children;

  const url = canonical(`/levels/${id}/`);
  const guide = getVerifiedLevelGuide(id);
  const faqs = getLevelFaqs(id, guide);
  const thumbnail = absoluteImage(getLevelCover(level));
  const videoObject = level.videoUrl && level.videoUploadDate && level.videoDurationIso
    ? {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: `Rotate Rings Level ${id} Walkthrough Solution`,
        description: `Complete gameplay solution for Rotate Rings Level ${id}.`,
        thumbnailUrl: [thumbnail],
        uploadDate: level.videoUploadDate,
        duration: level.videoDurationIso,
        embedUrl: level.videoUrl,
        contentUrl: level.videoId ? `https://www.youtube.com/watch?v=${level.videoId}` : level.videoUrl,
      }
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `Rotate Rings Level ${id} Walkthrough and Solution`,
        description: guide?.quickAnswer || `Complete video solution and board guide for Rotate Rings Level ${id}.`,
        image: [thumbnail],
        datePublished: LAST_SITE_UPDATE,
        dateModified: LAST_SITE_UPDATE,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "RotateRings.online Guide Team", url: canonical("/about-us/") },
        publisher: { "@type": "Organization", name: SITE_NAME, url: canonical() },
        ...(videoObject ? { video: { "@id": `${url}#video` } } : {}),
      },
      ...(videoObject ? [videoObject] : []),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonical() },
          { "@type": "ListItem", position: 2, name: `${GAME_NAME} Levels`, item: canonical("/levels/") },
          { "@type": "ListItem", position: 3, name: `Level ${id}`, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id={`level-${id}-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
