import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download Rotate Rings - iOS & Android",
  description: "Download Rotate Rings for iOS and Android from the official store listings. Route colored buses, match sand, and clear layered pictures.",
  keywords: ["Download Rotate Rings", "Rotate Rings iOS", "Rotate Rings Android", "ant puzzle game download", "color sorting game"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/download/"),
    siteName: SITE_NAME,
    title: 'Download Rotate Rings - iOS & Android',
    description: 'Download Rotate Rings and solve bus routing and sand color puzzles.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Download Rotate Rings'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download Rotate Rings - iOS & Android',
    description: 'Download Rotate Rings and solve bus routing and sand color puzzles.',
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
    canonical: canonical("/download/")
  }
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
