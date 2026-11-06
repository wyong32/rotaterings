import Image from "next/image";
import { Apple, CheckCircle2, ExternalLink, RotateCw, Star } from "lucide-react";
import { Footer } from "@/components/footer";
import { APP_STORE_URL, DOWNLOAD_COUNT, GAME_DEVELOPER, GOOGLE_PLAY_URL, RATING_COUNT, RATING_VALUE } from "@/lib/site";

export default function DownloadPage() {
  return (
    <div>
      <header className="border-b border-border bg-[#eaf8fb]">
        <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[#0b7285]">Official store listings</p>
            <h1 className="mt-3 text-4xl font-bold text-[#17313a] sm:text-5xl">Download Rotate Rings</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#435f68]">Get the mobile puzzle from Nebula Studio. Rotate interlocked pieces, align their gaps, and release the assembly one layer at a time.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#17313a] px-5 font-bold text-white"><Apple className="h-5 w-5" />App Store <ExternalLink className="h-4 w-4" /></a>
              <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d9480f] px-5 font-bold text-white"><RotateCw className="h-5 w-5" />Google Play <ExternalLink className="h-4 w-4" /></a>
            </div>
          </div>
          <Image src="/images/store/rotate-rings-level-10.webp" alt="Complete Rotate Rings mobile game interface" width={576} height={1246} className="mx-auto h-[430px] w-auto rounded-lg border border-[#9fcbd3] object-contain shadow-lg" priority />
        </div>
      </header>

      <main className="container mx-auto px-4 py-14 sm:px-6">
        <section className="grid gap-8 border-b border-border pb-12 sm:grid-cols-3">
          <div><p className="text-sm font-bold uppercase text-muted-foreground">Developer</p><p className="mt-2 text-xl font-bold">{GAME_DEVELOPER}</p></div>
          <div><p className="text-sm font-bold uppercase text-muted-foreground">Downloads</p><p className="mt-2 text-xl font-bold">{DOWNLOAD_COUNT}</p></div>
          <div><p className="text-sm font-bold uppercase text-muted-foreground">App Store rating</p><p className="mt-2 inline-flex items-center gap-2 text-xl font-bold"><Star className="h-5 w-5 fill-amber-400 text-amber-400" />{RATING_VALUE} from {Number(RATING_COUNT).toLocaleString()} ratings</p></div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-3xl font-bold">What You Do in the Game</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {["Inspect every ring, gap, clamp, and rigid support.", "Drag a ring until its opening faces the linked piece.", "Release outside rings before pieces with several links.", "Use the newly opened space to turn the next blocked ring.", "Remove rigid frames only after their attached rings are free.", "Check the full assembly before spending a hint or hammer."].map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#0b7285]" /><p className="leading-7 text-muted-foreground">{item}</p></div>)}
          </div>
          <h2 className="mt-12 text-3xl font-bold">Store Link Notice</h2>
          <p className="mt-4 leading-7 text-muted-foreground">The buttons above open the official App Store and Google Play pages. RotateRings.online does not host the application file and is not affiliated with the developer.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
