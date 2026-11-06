import type { Metadata } from "next";
import { canonical, gameDescription, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rotate Rings Levels Walkthroughs & Solutions",
  description: "Browse Rotate Rings level walkthroughs with complete videos, board screenshots, bus route notes, and color-matching puzzle solutions.",
  keywords: ["Rotate Rings levels", "Rotate Rings walkthrough", "Rotate Rings solutions", "ring puzzle guide", "circle puzzle solution", "spatial logic"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/levels/"),
    siteName: SITE_NAME,
    title: 'Rotate Rings Levels Walkthroughs & Solutions',
    description: gameDescription,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Rotate Rings available level walkthroughs'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate Rings Levels Walkthroughs & Solutions',
    description: 'Browse Rotate Rings level videos, bus routes, board images, and color-matching solutions.',
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
    canonical: canonical("/levels/")
  }
};

export default function LevelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
