import type { Metadata } from "next";
import { canonical, OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find Your Rotate Rings Level by Screenshot",
  description: "Upload a Rotate Rings board screenshot and compare it with available level guides. Your image stays on your device.",
  keywords: [
    "find Rotate Rings level",
    "Rotate Rings screenshot search",
    "Rotate Rings level finder",
    "Rotate Rings board match",
  ],
  alternates: { canonical: canonical("/find-level/") },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: canonical("/find-level/"),
    siteName: SITE_NAME,
    title: "Find Your Rotate Rings Level by Screenshot",
    description: "Compare a Rotate Rings board screenshot with available level guides. Image matching runs on your device.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rotate Rings screenshot level finder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Rotate Rings Level by Screenshot",
    description: "Compare a Rotate Rings screenshot with available guides without uploading the image.",
    images: [OG_IMAGE],
  },
};

export default function FindLevelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
