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

export interface LevelGuideMistake {
  title: string;
  action: string;
  consequence: string;
}

export interface LevelGuideComparisonImage {
  label: string;
  wrongImage: string;
  wrongAlt: string;
  correctImage: string;
  correctAlt: string;
}

export interface RingBoardItem {
  id: number;
  color: string;
  hex: string;
  x: number;
  y: number;
  position: string;
  initialAngle: number;
  scale: number;
  openingDegrees: number;
  linkedPoints: number;
  fixed: boolean;
}

export interface RingBoardData {
  officialConfigId: number;
  ringCount: number;
  supportCount: number;
  clampCount: number;
  colors: string[];
  rings: RingBoardItem[];
}

export interface RingRemovalCheckpoint {
  order: number;
  piece: string;
  color: string;
  position: string;
  action: string;
  result: string;
}

export interface LevelGuideStats {
  ringCount: number;
  supportCount: number;
  clampCount: number;
  verifiedMoveCount: number;
  colorCount: number;
  solutionDuration: string;
  criticalMove: string;
}

export interface LevelPhaseMetric {
  phase: string;
  moveRange: string;
  boardState: string;
  rule: string;
}

export interface VerifiedLevelGuide {
  objective: string;
  keyChallenge: string;
  previousLevelDifference: string;
  quickAnswer: string;
  overallStrategy: string[];
  startingBoard: string;
  boardData: RingBoardData;
  removalOrder: RingRemovalCheckpoint[];
  stats: LevelGuideStats;
  phaseMetrics: LevelPhaseMetric[];
  steps: LevelGuideStep[];
  beforeMove: string[];
  stuckPoint: string;
  commonMistakes: LevelGuideMistake[];
  comparisonImages?: LevelGuideComparisonImage[];
  sourceNote: string;
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
      answer: "Compare the opening layout, then follow the verified ring removal order without rotating a blocked center piece early.",
    },
    {
      question: `Why does my Rotate Rings Level ${id} board look different?`,
      answer: "Game updates can reorder levels. Use the screenshot finder to match the ring layout instead of relying only on the number.",
    },
    {
      question: "What should I check before rotating a ring?",
      answer: "Find the gap, identify the active connection, and confirm that the exit beyond that connection is open.",
    },
    {
      question: `Is the Level ${id} order verified?`,
      answer: "Written steps are published only after the board and completion state have been checked against a recording or official game configuration.",
    },
  ];
}
