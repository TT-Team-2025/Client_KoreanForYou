import { BookOpen, MessageSquare, Award, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";

interface LearningRecordCardProps {
  record: {
    id: number;
    type: 'conversation' | 'sentence';
    title: string;
    date: string;
    score?: number;
    duration?: string;
    progress?: number;
    completedSentences?: number;
    totalSentences?: number;
  };
  onClick?: () => void;
}

export function LearningRecordCard({ record, onClick }: LearningRecordCardProps) {
  return (
    <div 
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
        {record.type === 'sentence' ? (
          <BookOpen className="w-6 h-6 text-blue-500" />
        ) : (
          <MessageSquare className="w-6 h-6 text-green-500" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span>{record.title}</span>
          <Badge variant="outline" className="text-xs">
            {record.type === 'sentence' ? '문장학습' : 'AI대화'}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>{record.date}</span>
          {record.type === 'conversation' && record.score !== undefined && (
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              {record.score}점
            </span>
          )}
          {record.type === 'sentence' && record.progress !== undefined && (
            <span>진행률 {record.progress}%</span>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}
