import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us - RotateRings.online",
  description: "Contact RotateRings.online with Rotate Rings level requests, walkthrough corrections, and site feedback.",
  keywords: ["Contact Rotate Rings Guide", "feedback", "support", "level requests"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/contact-us/"),
    siteName: SITE_NAME,
    title: 'Contact Us - RotateRings.online',
    description: 'Contact RotateRings.online with Rotate Rings guide feedback and level requests.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Contact RotateRings.online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - RotateRings.online',
    description: 'Contact RotateRings.online with Rotate Rings guide feedback.',
    images: [OG_IMAGE]
  },
  alternates: { canonical: canonical("/contact-us/") }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
