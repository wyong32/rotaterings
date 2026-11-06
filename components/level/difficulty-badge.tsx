import { Badge } from "@/components/ui/badge";
import { Difficulty } from "@/types";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const difficultyColors = {
  Easy: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Hard: "bg-orange-100 text-orange-800 border-orange-200",
  Expert: "bg-red-100 text-red-800 border-red-200",
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(difficultyColors[difficulty], className)}
    >
      {difficulty}
    </Badge>
  );
}
