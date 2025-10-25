import { Badge } from "../ui/badge";
import { JOB_INFO, JobKey } from "../../constants/jobs";

interface JobBadgeProps {
  jobKey: JobKey;
  showEmoji?: boolean;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function JobBadge({ jobKey, showEmoji = true, variant = "secondary" }: JobBadgeProps) {
  const job = JOB_INFO[jobKey];
  
  if (!job) {
    return null;
  }
  
  return (
    <Badge variant={variant} className={job.color}>
      {showEmoji && <span className="mr-1">{job.emoji}</span>}
      {job.name}
    </Badge>
  );
}
