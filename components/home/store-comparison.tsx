import { Apple, ExternalLink, Gamepad2, PlayCircle } from "lucide-react";
import { APP_STORE_URL, GAME_DEVELOPER, GOOGLE_PLAY_URL, ONLINE_GAME_URL } from "@/lib/site";

const options = [
  {
    name: "App Store",
    href: APP_STORE_URL,
    icon: Apple,
    device: "iPhone and iPad",
    access: "Install from Apple's store listing",
    note: "Use this listing for the iOS version, device compatibility, current release notes, privacy details, and updates delivered through the App Store.",
  },
  {
    name: "Google Play",
    href: GOOGLE_PLAY_URL,
    icon: PlayCircle,
    device: "Android phones and tablets",
    access: "Install from Google Play",
    note: "Use this listing for the Android package published under the game's store identity, supported devices, update history, and Google Play reviews.",
  },
  {
    name: "Browser game",
    href: ONLINE_GAME_URL,
    icon: Gamepad2,
    device: "Desktop and mobile browsers",
    access: "Open the authorized web build",
    note: "Use the same browser build embedded on this page. It opens without an application download and keeps the game separate from unverified catalog search results.",
  },
];

export function StoreComparison() {
  return (
    <section className="border-b border-border bg-[#f4f8f1] py-14" aria-labelledby="where-to-get-heading">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-[#0b7285]">Mobile and browser access</p>
          <h2 id="where-to-get-heading" className="mt-2 text-3xl font-bold sm:text-4xl">Where to Get Rotate Rings</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Rotate Rings is associated with {GAME_DEVELOPER}. RotateRings.online does not host an application file. The links below go to the authorized browser build or the official App Store and Google Play listings, so you can check the publisher, current version, device support, and privacy information before installing or playing. The embedded game at the top of this page remains the fastest option when you want to start without a download.</p>
        </div>

        <div className="mt-8 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-background text-sm uppercase text-muted-foreground"><tr><th className="px-4 py-4">Option</th><th className="px-4 py-4">Best for</th><th className="px-4 py-4">Access</th><th className="px-4 py-4">What to verify</th></tr></thead>
            <tbody className="divide-y divide-border bg-white">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <tr key={option.name}>
                    <td className="px-4 py-5"><a href={option.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-primary hover:underline"><Icon className="h-5 w-5" />{option.name}<ExternalLink className="h-4 w-4" /></a></td>
                    <td className="px-4 py-5 font-semibold">{option.device}</td>
                    <td className="px-4 py-5 text-muted-foreground">{option.access}</td>
                    <td className="max-w-lg px-4 py-5 leading-7 text-muted-foreground">{option.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 max-w-4xl space-y-4 leading-7 text-muted-foreground">
          <p>The mobile listings are useful when you want native touch controls, store-managed updates, and play outside the browser. The browser version is useful for quickly checking a board or following a guide on the same device. Progress may be stored differently by each provider, so do not assume that a level completed in one version will appear as completed in another.</p>
          <p>Level order can also differ after a release. Before deciding that a guide is wrong, compare the opening geometry, ring colors, rails, clamps, and center links. If those facts differ, use the screenshot finder instead of changing the written solution to fit a different board.</p>
        </div>
      </div>
    </section>
  );
}
