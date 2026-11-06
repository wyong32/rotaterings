import Image from "next/image";
import Link from "next/link";
import { GAME_DEVELOPER, GAME_NAME, SITE_NAME } from "@/lib/site";

const popularLevels = [1, 2, 5, 8, 10, 13, 17, 20];
const guideLevels = [3, 4, 6, 9, 12, 14, 16, 19];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Rotate Rings Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-full h-full"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{GAME_NAME}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SITE_NAME} provides Rotate Rings walkthrough videos, level solutions, route-planning tips, and download guidance for the mobile puzzle game by {GAME_DEVELOPER}.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-3">
              {[
                ["/", "Home"],
                ["/levels/", "Level Solutions"],
                ["/find-level/", "Find by Screenshot"],
                ["/blog/", "Blog"],
                ["/download/", "Download"],
                ["/about-us/", "About Us"],
                ["/contact-us/", "Contact Us"],
              ].map(([href, label]) => (
                <li key={href}>
                  {href === "/find-level/" ? (
                    <a href={href} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Popular Levels</h3>
            <ul className="space-y-3">
              {popularLevels.map((level) => (
                <li key={level}>
                  <Link href={`/levels/${level}/`} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                    Rotate Rings Level {level}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Level Guides</h3>
            <ul className="space-y-3">
              {guideLevels.map((level) => (
                <li key={level}>
                  <Link href={`/levels/${level}/`} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                    Level {level} Walkthrough
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border"></div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Copyright 2026 {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
