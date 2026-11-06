import type { CSSProperties } from "react";

interface ArticleContentWithAdsProps {
  content: string;
  className?: string;
  style?: CSSProperties;
}

export function ArticleContentWithAds({ content, className = "", style }: ArticleContentWithAdsProps) {
  return (
    <div className={className} style={style} dangerouslySetInnerHTML={{ __html: content }} />
  );
}
