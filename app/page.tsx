import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { HomeFaq, homeFaqs } from "@/components/home/home-faq";
import { HowToPlay } from "@/components/home/how-to-play";
import { LevelHelp } from "@/components/home/level-help";
import { LevelNavigation } from "@/components/home/level-navigation";
import { OnlineGame } from "@/components/home/online-game";
import { StoreComparison } from "@/components/home/store-comparison";
import {
  APP_STORE_URL,
  canonical,
  GAME_DEVELOPER,
  GAME_NAME,
  GOOGLE_PLAY_URL,
  OG_IMAGE,
  ONLINE_GAME_URL,
  SITE_NAME,
  SITE_URL,
  gameDescription,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Play Rotate Rings Online - Free Browser Puzzle",
  description: "Play Rotate Rings online for free, learn the ring-release rules, find a matching level by number or screenshot, and open verified step-by-step solutions.",
  alternates: { canonical: canonical() },
  openGraph: {
    title: "Play Rotate Rings Online - Free Browser Puzzle",
    description: "Play in your browser and use verified board screenshots, removal orders, and level solutions when you get stuck.",
    url: canonical(),
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rotate Rings online puzzle and level guide" }],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: canonical(),
        description: gameDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/levels/level-{level}/`,
          "query-input": "required name=level",
        },
      },
      {
        "@type": "VideoGame",
        "@id": `${SITE_URL}/#game`,
        name: GAME_NAME,
        url: canonical(),
        description: gameDescription,
        gamePlatform: ["Web browser", "iOS", "Android"],
        playMode: "SinglePlayer",
        applicationCategory: "PuzzleGame",
        author: { "@type": "Organization", name: GAME_DEVELOPER },
        sameAs: [ONLINE_GAME_URL, APP_STORE_URL, GOOGLE_PLAY_URL],
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: canonical() }],
      },
    ],
  };

  return (
    <div>
      <Script id="home-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} strategy="beforeInteractive" />
      <OnlineGame />
      <HeroSection />
      <HowToPlay />
      <LevelHelp />
      <StoreComparison />
      <LevelNavigation />
      <HomeFaq />
      <Footer />
    </div>
  );
}
