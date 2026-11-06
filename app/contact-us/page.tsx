import { Footer } from "@/components/footer";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

const CONTACT_EMAIL = "support@rotaterings.online";

export const metadata = {
  title: "Contact Us - Rotate Rings Guide",
  description: "Contact the RotateRings.online guide team with level requests, broken video reports, feedback, or Rotate Rings walkthrough suggestions.",
};

export default function ContactUsPage() {
  return (
    <div>
      <section className="container mx-auto px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl">Contact Us</h1>

          <div className="space-y-8">
            <section className="text-muted-foreground">
              <p className="leading-relaxed text-lg mb-6">
                Contact {SITE_NAME} if you want to report a missing Rotate Rings level, suggest a better walkthrough route, or share feedback about our guide pages.
              </p>
            </section>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border bg-card/50 p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-3">Send level notes or site feedback</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary/80 hover:underline text-sm">
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Guide Feedback</h3>
                <p className="text-sm text-muted-foreground">Tell us if a route is unclear, outdated, or missing a useful tip.</p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">We review guide requests and technical reports as updates are scheduled.</p>
              </div>
            </div>

            <section className="rounded-lg border border-border bg-card/50 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">What to Include</h2>
              <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                <li className="leading-relaxed">The Rotate Rings level number.</li>
                <li className="leading-relaxed">A short description of the issue or suggested route.</li>
                <li className="leading-relaxed">A video link or screenshot if it helps explain the board.</li>
                <li className="leading-relaxed">The device or browser if you are reporting a site problem.</li>
              </ul>
            </section>

            <section className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-3">Help Improve the Guide</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Accurate level routes make the site more useful for Rotate Rings players. Send corrections when you find a clearer solution.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Mail className="h-5 w-5" />
                Send Us an Email
              </a>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
