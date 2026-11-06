"use client";

import { AffiliateAd } from "@/components/ads/affiliate-ad";

type BannerPlacement = "top" | "middle" | "bottom";

// GPT is intentionally disabled for rotaterings.online. Existing placements keep
// this compatibility wrapper while rendering affiliate ads instead.
export function GptAd({ placement, className = "" }: { placement: BannerPlacement; className?: string }) {
  return <AffiliateAd placement={placement} className={className} />;
}

export function GptAnchorAd() {
  return null;
}

export function GptSideRailAds() {
  return null;
}

export function GptInterstitialAd() {
  return null;
}
