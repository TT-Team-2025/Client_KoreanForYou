import { Badge } from "../ui/badge";

interface LevelBadgeProps {
  level: number;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const LEVEL_NAMES: Record<number, string> = {
  1: "초급",
  2: "중급",
  3: "고급"
};

export function LevelBadge({ level, variant = "secondary" }: LevelBadgeProps) {
  const levelName = LEVEL_NAMES[level] || "알 수 없음";
  
  return (
    <Badge variant={variant}>
      {levelName}
    </Badge>
  );
}
