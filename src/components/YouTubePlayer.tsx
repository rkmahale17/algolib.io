import { Card } from "@/components/ui/card";
import { ExternalLink, Youtube } from "lucide-react";
import React, { useEffect, useState } from "react";

interface YouTubeMetadata {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
}

interface YouTubePlayerProps {
  youtubeUrl: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ youtubeUrl }) => {
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [error, setError] = useState(false);

  // Extract video ID from URL
  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // If it's just the video ID
    if (url.length === 11 && !url.includes("/")) {
      return url;
    }

    return null;
  };

  const videoId = getVideoId(youtubeUrl);

  useEffect(() => {
    if (!videoId) {
      setError(true);
      return;
    }

    // Fetch metadata using YouTube's oEmbed endpoint
    const fetchMetadata = async () => {
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error("Error fetching YouTube metadata:", err);
        setError(true);
      }
    };

    fetchMetadata();
  }, [videoId]);

  if (!videoId || error) {
    return null;
  }

  if (!metadata) {
    return (
      <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
        <div className="text-center py-4 text-sm text-muted-foreground">
          Loading video...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold">Video Tutorial</h3>
        </div>

        {/* Video Title */}
        <h4 className="text-lg font-bold text-foreground">{metadata.title}</h4>

        {/* Channel Info & Credits */}
        <div className="flex flex-col gap-1">
          <a
            href={metadata.author_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 w-fit"
          >
            Channel: {metadata.author_name}
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-xs text-muted-foreground">
            🎥 Video by {metadata.author_name} on YouTube
          </p>
        </div>

        {/* Responsive YouTube Player */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={metadata.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </Card>
  );
};
