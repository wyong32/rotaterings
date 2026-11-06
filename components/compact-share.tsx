"use client";

import { Check, Copy, Facebook, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

interface CompactShareProps {
  title: string;
  url: string;
}

export function CompactShare({ title, url }: CompactShareProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const sharePage = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await copyLink();
  };

  const iconClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground";

  return (
    <div className="flex items-center gap-2" aria-label="Share this guide">
      <span className="mr-1 text-sm font-medium text-muted-foreground">Share this guide</span>
      <a
        className={iconClass}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" aria-hidden="true" />
      </a>
      <a
        className={iconClass}
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
      </a>
      <button className={iconClass} type="button" onClick={copyLink} aria-label="Copy guide link" title="Copy guide link">
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      </button>
      <button className={iconClass} type="button" onClick={sharePage} aria-label="Share guide" title="Share guide">
        <Share2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
