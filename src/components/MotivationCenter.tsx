import React, { useState } from 'react';
import {
    Play,
    Video,
    X,
    RotateCcw,
    ExternalLink,
    Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { MOTIVATION_VIDEOS, MotivationVideo } from '@/data/motivationData';
import { cn } from '@/lib/utils';

export const MotivationCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<MotivationVideo | null>(null);

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <TooltipProvider>
                <Tooltip>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <Button
                                    size="icon"
                                    className={cn(
                                        "w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 bg-background border border-border text-foreground hover:bg-muted dark:bg-secondary dark:border-border",
                                        isOpen && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                    )}
                                >
                                    <Lightbulb className="w-5 h-5 text-primary" />
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-zinc-900 text-zinc-100 border-zinc-800">
                            <p>Need some inspiration?</p>
                        </TooltipContent>
                        <PopoverContent className="w-80 sm:w-96 p-0 glass-card border-border shadow-2xl overflow-hidden bg-background" align="start" sideOffset={16}>
                            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <Lightbulb className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-sm">Inspiration Center</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Power up your session</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="p-4 space-y-4">
                                {selectedVideo ? (
                                    <div className="space-y-3">
                                        <div className="relative aspect-video rounded-xl border border-border overflow-hidden bg-black">
                                            {/* ... iframe logic remains same ... */}
                                            {(() => {
                                                const getYTId = (url: string) => {
                                                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                                    const match = url.match(regExp);
                                                    return (match && match[2].length === 11) ? match[2] : null;
                                                };
                                                const vidId = getYTId(selectedVideo.url);
                                                return (
                                                    <iframe
                                                        className="absolute inset-0 w-full h-full"
                                                        src={`https://www.youtube.com/embed/${vidId}?autoplay=1`}
                                                        title={selectedVideo.title}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                );
                                            })()}
                                        </div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-medium text-xs text-foreground">{selectedVideo.title}</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                                                onClick={() => setSelectedVideo(null)}
                                            >
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Explore More
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <Video className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-foreground">Visual Inspiration</h4>
                                                <p className="text-[10px] text-muted-foreground leading-tight">Handpicked videos to spark your coding drive.</p>
                                            </div>
                                        </div>

                                        <ScrollArea className="h-72 pr-4">
                                            <div className="grid grid-cols-1 gap-2">
                                                {MOTIVATION_VIDEOS.map((video) => (
                                                    <button
                                                        key={video.id}
                                                        onClick={() => setSelectedVideo(video)}
                                                        className="w-full flex gap-3 p-2 rounded-xl transition-all border border-transparent hover:border-border hover:bg-muted text-left group"
                                                    >
                                                        <div className="relative w-24 h-14 rounded-lg overflow-hidden shrink-0 border border-border">
                                                            <img
                                                                src={video.thumbnail}
                                                                alt={video.title}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Play className="w-4 h-4 fill-white text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 py-1">
                                                            <h5 className="text-[11px] font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                                                {video.title}
                                                            </h5>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Badge variant="outline" className="text-[8px] h-3 px-1 border-border bg-muted leading-none">YouTube</Badge>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}

                                <div className="pt-2 border-t border-border flex items-center justify-center">
                                    <a
                                        href="https://www.youtube.com/results?search_query=programming+motivation"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-muted-foreground flex items-center hover:text-primary transition-colors"
                                    >
                                        View more on YouTube <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                    </a>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
