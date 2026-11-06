import Script from "next/script";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { LevelNavigation } from "@/components/home/level-navigation";
import { APP_STORE_URL, canonical, GAME_DEVELOPER, GAME_NAME, GOOGLE_PLAY_URL, RATING_COUNT, RATING_VALUE, SITE_NAME, SITE_URL, gameDescription } from "@/lib/site";

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
          target: `${SITE_URL}/levels/{level}/`,
          "query-input": "required name=level",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: GAME_NAME,
        applicationCategory: "GameApplication",
        operatingSystem: "iOS, Android",
        description: gameDescription,
        author: { "@type": "Organization", name: GAME_DEVELOPER },
        sameAs: [APP_STORE_URL, GOOGLE_PLAY_URL],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: RATING_VALUE,
          ratingCount: RATING_COUNT,
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          ["How do you play Rotate Rings?", "Send buses through open routes and match each bus with sand of the same color."],
          ["Why do buses get stuck?", "A vehicle may be blocked by another bus, or parking may be full of colors that cannot collect the current sand."],
          ["Where can I download Rotate Rings?", "The game is available through its official App Store and Google Play listings."],
          ["Does this site publish every Rotate Rings level?", "The site publishes only levels with a complete source video and checked screenshots."],
        ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
      },
    ],
  };

  return (
    <div>
      <Script id="home-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} strategy="beforeInteractive" />
      <HeroSection />
      <LevelNavigation />
      <Footer />
    </div>
  );
}
