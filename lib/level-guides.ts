import guideData from "@/data/level-guides.json";

export interface LevelGuideStep {
  title: string;
  instruction: string;
  image?: string;
  imageAlt?: string;
}

export interface LevelGuideFaq {
  question: string;
  answer: string;
}

export type LevelMoveDirection =
  | "up"
  | "up-right"
  | "right"
  | "down-right"
  | "down"
  | "down-left"
  | "left"
  | "up-left";

export interface LevelGuideStats {
  parkingCapacity: number;
  verifiedMoveCount: number;
  colorCount: number;
  solutionDuration: string;
  criticalRoute: string;
}

export interface LevelMoveCheckpoint {
  order: number;
  color: string;
  vehicle: string;
  direction: LevelMoveDirection;
  row?: number;
  column?: number;
  region: string;
  xPercent: number;
  yPercent: number;
  purpose: string;
  parkingCheck: string;
  precondition?: string;
  instruction?: string;
  result?: string;
  risk?: string;
}

export interface LevelPhaseMetric {
  phase: string;
  moveRange: string;
  boardState: string;
  parkingRule: string;
}

export interface VerifiedLevelGuide {
  positionSystem?: 'full-frame';
  objective: string;
  keyChallenge: string;
  quickAnswer: string;
  overallStrategy: string[];
  startingBoard: string;
  stats: LevelGuideStats;
  moveCheckpoints: LevelMoveCheckpoint[];
  phaseMetrics: LevelPhaseMetric[];
  steps: LevelGuideStep[];
  beforeMove: string[];
  stuckPoint: string;
  faqs: LevelGuideFaq[];
}

const guides = guideData as Record<string, VerifiedLevelGuide>;

export function getVerifiedLevelGuide(id: string): VerifiedLevelGuide | undefined {
  return guides[id];
}

export function getLevelFaqs(id: string, guide?: VerifiedLevelGuide): LevelGuideFaq[] {
  if (guide) return guide.faqs;

  return [
    {
      question: `How do I solve Rotate Rings Level ${id}?`,
      answer: `Use the complete Level ${id} video and keep the same bus order, open routes, and parking state shown in the recording.`,
    },
    {
      question: `Why does my Rotate Rings Level ${id} board look different?`,
      answer: "Game updates can reorder level numbers. Use the screenshot finder to compare the board rather than relying only on its number.",
    },
    {
      question: "What should I check before selecting a bus?",
      answer: "Confirm that the bus can reach the road, a parking space is open, and matching sand is exposed.",
    },
    {
      question: `Is a written move list available for Level ${id}?`,
      answer: "The written steps are published only after the full video has been checked. Until then, the embedded video remains the source solution.",
    },
  ];
}
