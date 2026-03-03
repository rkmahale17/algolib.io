import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronUp, User, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Comment {
    id: string;
    user_full_name: string;
    user_avatar?: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
}

interface FeedbackDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: {
        id: string;
        title: string;
        description: string;
        type: 'suggestion' | 'bug';
        status: string;
        upvotes_count: number;
        user_full_name?: string;
        created_at: string;
        has_voted: boolean;
        comments_count: number;
    } | null;
    comments: Comment[];
    isSubmittingComment: boolean;
    onVote: (id: string) => void;
    onAddComment: (content: string, isAnonymous: boolean) => void;
}

export const FeedbackDetailModal = ({
    isOpen,
    onClose,
    feedback,
    comments,
    isSubmittingComment,
    onVote,
    onAddComment,
}: FeedbackDetailModalProps) => {
    const [newComment, setNewComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    if (!feedback) return null;

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;
        onAddComment(newComment, isAnonymous);
        setNewComment("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin p-0">
                <div className="p-6">
                    <DialogHeader className="flex-row items-center gap-4 space-y-0 mb-6 relative">
                        <div className="flex flex-col items-center justify-center bg-green-50 border border-green-200 rounded-lg p-2 min-w-[50px]">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "p-0 h-auto hover:bg-transparent",
                                    feedback.has_voted ? "text-green-600" : "text-muted-foreground"
                                )}
                                onClick={() => onVote(feedback.id)}
                            >
                                <ChevronUp className="w-5 h-5" />
                            </Button>
                            <span className="text-sm font-bold text-green-700 leading-none">
                                {feedback.upvotes_count}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[10px] uppercase py-0 border-muted-foreground/20">
                                    {feedback.status.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{format(new Date(feedback.created_at), 'MMM d')}</span>
                                    <span>•</span>
                                    <span>{feedback.user_full_name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{feedback.comments_count} comments</span>
                                </div>
                            </div>
                            <DialogTitle className="text-xl md:text-2xl font-bold">{feedback.title}</DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="prose prose-sm max-w-none text-muted-foreground mb-8 border-b pb-8">
                        <p className="whitespace-pre-wrap">{feedback.description}</p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-semibold text-lg">Discussion</h4>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold flex-shrink-0">
                                U
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Leave a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[100px] resize-none border-muted focus-visible:ring-green-600"
                                        disabled={isSubmittingComment}
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="comment-anonymous"
                                                checked={isAnonymous}
                                                onCheckedChange={(checked) => setIsAnonymous(!!checked)}
                                                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                            />
                                            <Label htmlFor="comment-anonymous" className="text-sm font-normal text-muted-foreground cursor-pointer">
                                                Post anonymously
                                            </Label>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-green-500/50 hover:bg-green-500 text-white"
                                            disabled={isSubmittingComment || !newComment.trim()}
                                            onClick={handleSubmitComment}
                                        >
                                            Post Comment
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold flex-shrink-0">
                                                {comment.is_anonymous ? <User className="w-5 h-5 text-muted-foreground" /> : comment.user_full_name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm">
                                                        {comment.is_anonymous ? 'Anonymous' : comment.user_full_name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(comment.created_at), 'MMM d')}
                                                    </span>
                                                </div>
                                                <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
