export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export interface GuideSection {
  title: string;
  steps: string[];
  images?: string[];
}

export interface Level {
  id: string;
  title: string;
  difficulty: Difficulty;
  publishedAt: string;
  modifiedAt: string;
  thumbnail: string;
  category: string;
  description: string;
  guide: GuideSection[];
  tips: string[];
  tags: string[];
  completionTime?: string;
  videoUrl?: string;
  videoId?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  videoTitle?: string;
  coverImage?: string;
  matchImages?: string[];
  guideImages?: string[];
  assetVersion?: number;
  videoUploadDate?: string;
  videoDurationIso?: string;
  sourceType?: "youtube-video" | "official-online-config";
  sourceStartSecond?: number;
}
