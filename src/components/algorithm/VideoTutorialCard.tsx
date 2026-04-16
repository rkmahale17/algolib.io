import React from 'react';
import { Card } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { RichText } from '@/components/RichText';

interface Tutorial {
  url: string;
  moreInfo?: string;
}

interface VideoTutorialCardProps {
  tutorial: Tutorial;
  title?: string;
}

export const VideoTutorialCard: React.FC<VideoTutorialCardProps> = ({ tutorial, title = "Video Tutorial" }) => {
  if (!tutorial?.url) return null;

  const videoId = tutorial.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] || tutorial.url;

  return (
    <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          {tutorial.moreInfo && (
            <RichText content={tutorial.moreInfo} />
          )}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="pt-2 border-t border-border/50">
            <p className="text-[10px] sm:text-xs text-muted-foreground italic">
              <strong>Credits:</strong> Video tutorial by NeetCode (used with permission). All written
              explanations, code examples, and additional insights provided by algolib.io.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
