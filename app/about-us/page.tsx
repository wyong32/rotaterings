import { Footer } from "@/components/footer";
import { GAME_DEVELOPER, GAME_NAME, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "About Us - Rotate Rings Guide",
  description: "Learn about RotateRings.online, an independent guide site for Rotate Rings walkthroughs, level solutions, tips, and download information.",
};

export default function AboutUsPage() {
  return (
    <div>
      <section className="container mx-auto px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl">About Us</h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to {SITE_NAME}</h2>
              <p className="leading-relaxed mb-4">
                {SITE_NAME} is an independent guide site for {GAME_NAME}, the bus-routing and color-matching puzzle by {GAME_DEVELOPER}. We organize walkthrough videos, board images, level solutions, and route notes.
              </p>
              <p className="leading-relaxed">
                We publish the source video for every listed level. Written notes are added after the bus field, sand picture, parking state, and progress screenshots have been checked against the successful run.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
              <ul className="space-y-3 ml-6 list-disc">
                <li className="leading-relaxed">Available Rotate Rings level walkthroughs with embedded video guides.</li>
                <li className="leading-relaxed">Checked written steps for levels that have completed editorial review.</li>
                <li className="leading-relaxed">A browser-only screenshot finder for matching a board to available guides.</li>
                <li className="leading-relaxed">Beginner-friendly articles for learning the game mechanics.</li>
                <li className="leading-relaxed">Download links for the official iOS and Android app pages.</li>
                <li className="leading-relaxed">Updates when reliable level videos and board images are available.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Independent Guide Notice</h2>
              <p className="leading-relaxed">
                {SITE_NAME} is a fan-made guide resource and is not affiliated with, endorsed by, or officially connected to {GAME_DEVELOPER}. All trademarks and app store references belong to their respective owners.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card/50 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="leading-relaxed">
                Found a missing level, broken video, or mismatched board? Visit our <a href="/contact-us/" className="text-primary hover:text-primary/80 hover:underline">Contact Us</a> page and send the details.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
