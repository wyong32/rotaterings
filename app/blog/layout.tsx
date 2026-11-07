import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rotate Rings Updates & Site News",
  description: "Read dated Rotate Rings game updates, version changes, new level coverage notices, and RotateRings.online site news.",
  keywords: ["Rotate Rings updates", "Rotate Rings news", "Rotate Rings version changes", "RotateRings.online updates"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/blog/"),
    siteName: SITE_NAME,
    title: 'Rotate Rings Updates & Site News',
    description: 'Read dated game updates, version changes, level coverage notices, and site news.',
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
    title: 'Rotate Rings Updates & Site News',
    description: 'Read dated Rotate Rings game updates and RotateRings.online site news.',
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
