import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
    id: string;
    title: string;
    description: string;
    type: 'suggestion' | 'bug';
    status: string;
    upvotes_count: number;
    comments_count: number;
    is_anonymous: boolean;
    user_full_name?: string;
    user_avatar?: string;
    created_at: string;
    has_voted: boolean;
    onVote: (e: React.MouseEvent) => void;
    onClick: () => void;
}

export const FeedbackCard = ({
    title,
    description,
    type,
    status,
    upvotes_count,
    comments_count,
    is_anonymous,
    user_full_name,
    created_at,
    has_voted,
    onVote,
    onClick,
}: FeedbackCardProps) => {
    return (
        <Card
            className="p-4 md:p-6 mb-4 hover:border-primary/50 transition-colors cursor-pointer group relative"
            onClick={onClick}
        >
            <div className="flex gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors pr-12">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4">
                        {description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <Badge
                            variant="outline"
                            className={cn(
                                "capitalize py-0.5",
                                type === 'bug' ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"
                            )}
                        >
                            {type === 'bug' ? 'Bug' : 'Feature'}
                        </Badge>

                        <div className="flex items-center gap-1.5 grayscale opacity-70">
                            <MessageSquare className="w-4 h-4" />
                            <span>{comments_count}</span>
                        </div>

                        <div className="hidden md:block text-muted-foreground/30">•</div>

                        <div className="flex items-center gap-2">
                            {is_anonymous ? (
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-3 h-3" />
                                    </div>
                                    <span>Anonymous</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                        {user_full_name?.charAt(0) || 'U'}
                                    </div>
                                    <span>{user_full_name || 'User'}</span>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block text-muted-foreground/30">•</div>

                        <span>{format(new Date(created_at), 'MMM d, yyyy')}</span>

                        {status !== 'pending' && (
                            <Badge variant="secondary" className="capitalize text-[10px] py-0">
                                {status.replace('_', ' ')}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-start pt-1">
                    <Button
                        variant={has_voted ? "default" : "outline"}
                        className={cn(
                            "flex flex-col h-auto py-2 px-3 gap-0 border-2",
                            has_voted ? "bg-green-600 hover:bg-green-700 border-green-600" : "hover:border-green-600 hover:text-green-600"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote(e);
                        }}
                    >
                        <ChevronUp className={cn("w-5 h-5", has_voted ? "text-white" : "")} />
                        <span className={cn("text-xs font-bold leading-none", has_voted ? "text-white" : "")}>
                            {upvotes_count}
                        </span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};
