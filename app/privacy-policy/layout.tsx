import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy - RotateRings.online",
  description: "Read the Privacy Policy for RotateRings.online and learn how this guide site handles basic website data.",
  keywords: ["Privacy Policy", "RotateRings.online", "data protection", "privacy"],
  authors: [{ name: "Rotate Rings Guide Team" }],
  openGraph: {
    type: 'website',
    url: canonical("/privacy-policy/"),
    siteName: SITE_NAME,
    title: 'Privacy Policy - RotateRings.online',
    description: 'Read the Privacy Policy for RotateRings.online.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'RotateRings.online Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - RotateRings.online',
    description: 'Read the Privacy Policy for RotateRings.online.',
    images: [OG_IMAGE]
  },
  alternates: { canonical: canonical("/privacy-policy/") }
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
