import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us - RotateRings.online",
  description: "Learn about RotateRings.online, an independent Rotate Rings walkthrough and strategy guide site.",
  keywords: ["About Rotate Rings Guide", "RotateRings.online", "puzzle game guide", "game walkthrough"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/about-us/"),
    siteName: SITE_NAME,
    title: 'About Us - RotateRings.online',
    description: 'Learn about RotateRings.online, an independent Rotate Rings walkthrough and strategy guide site.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'About RotateRings.online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - RotateRings.online',
    description: 'Learn about RotateRings.online, an independent Rotate Rings guide site.',
    images: [OG_IMAGE]
  },
  alternates: { canonical: canonical("/about-us/") }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
