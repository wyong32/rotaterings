import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service - RotateRings.online",
  description: "Read the Terms of Service for using RotateRings.online and its Rotate Rings walkthrough guides.",
  keywords: ["Terms of Service", "RotateRings.online", "terms and conditions", "legal"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/terms-of-service/"),
    siteName: SITE_NAME,
    title: 'Terms of Service - RotateRings.online',
    description: 'Read the Terms of Service for RotateRings.online.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'RotateRings.online Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - RotateRings.online',
    description: 'Read the Terms of Service for RotateRings.online.',
    images: [OG_IMAGE]
  },
  alternates: { canonical: canonical("/terms-of-service/") }
};

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
