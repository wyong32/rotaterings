"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  thumbnail: string;
  startSeconds?: number;
}

export function YouTubePlayer({ videoId, title, thumbnail, startSeconds = 0 }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="aspect-video w-full overflow-hidden border bg-black">
      {playing ? (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&start=${Math.max(0, Math.floor(startSeconds))}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="group relative h-full w-full"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
        >
          <Image
            src={thumbnail}
            alt={`${title} video preview`}
            fill
            priority
            unoptimized
            sizes="(min-width: 768px) 70vw, 100vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" aria-hidden="true" />
          <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform group-hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
