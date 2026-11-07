import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rotate Rings Guides: How to Play, Tips, Level Changes & Platforms",
  description: "Read detailed Rotate Rings guides covering controls, removal strategy, changed level numbers, screenshot matching, and safe places to play.",
  keywords: ["Rotate Rings guide", "how to play Rotate Rings", "Rotate Rings tips", "Rotate Rings level numbers", "play Rotate Rings"],
  alternates: { canonical: canonical("/guides/") },
  openGraph: {
    type: "website",
    url: canonical("/guides/"),
    siteName: SITE_NAME,
    title: "Rotate Rings Guides",
    description: "Practical guides for playing Rotate Rings, solving interlocked boards, matching reordered levels, and choosing a platform.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rotate Rings guide library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate Rings Guides",
    description: "Practical Rotate Rings rules, strategy, screenshot matching, and platform guidance.",
    images: [OG_IMAGE],
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
