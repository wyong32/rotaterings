import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rotate Rings Blog - Guides, Tips & Strategy",
  description: "Read Rotate Rings strategy articles about bus routes, sand colors, parking capacity, screenshot matching, and level solutions.",
  keywords: ["Rotate Rings blog", "Rotate Rings guide", "Rotate Rings tips", "ring puzzle strategy", "circle puzzle walkthrough"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/blog/"),
    siteName: SITE_NAME,
    title: 'Rotate Rings Blog - Guides, Tips & Strategy',
    description: 'Read Rotate Rings strategy articles, beginner tips, routing notes, and parking advice.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Rotate Rings Blog'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate Rings Blog - Guides, Tips & Strategy',
    description: 'Read Rotate Rings strategy articles, beginner tips, and walkthrough notes.',
    images: [OG_IMAGE]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: canonical("/blog/")
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
