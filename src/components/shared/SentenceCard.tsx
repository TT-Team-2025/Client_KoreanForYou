import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Volume2, Mic } from "lucide-react";

interface SentenceCardProps {
  korean: string;
  english: string;
  synonyms?: string[];
  onPlayAudio?: () => void;
  onRecord?: () => void;
  showControls?: boolean;
}

export function SentenceCard({ 
  korean, 
  english, 
  synonyms, 
  onPlayAudio, 
  onRecord,
  showControls = true 
}: SentenceCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Main Sentence */}
          <div className="text-center">
            <p className="text-2xl mb-3">{korean}</p>
            <p className="text-gray-600 mb-4">{english}</p>
          </div>

          {/* Synonyms */}
          {synonyms && synonyms.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">비슷한 표현:</p>
              <div className="space-y-1">
                {synonyms.map((synonym, idx) => (
                  <p key={idx} className="text-sm">• {synonym}</p>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          {showControls && (
            <div className="flex gap-2 justify-center">
              {onPlayAudio && (
                <Button variant="outline" onClick={onPlayAudio} className="gap-2">
                  <Volume2 className="w-4 h-4" />
                  발음 듣기
                </Button>
              )}
              {onRecord && (
                <Button variant="outline" onClick={onRecord} className="gap-2">
                  <Mic className="w-4 h-4" />
                  녹음하기
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
