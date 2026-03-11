import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FeedbackSubmissionSidebarProps {
    isSubmitting: boolean;
    onSubmit: (data: { title: string; description: string; type: 'suggestion' | 'bug'; is_anonymous: boolean }) => void;
}

export const FeedbackSubmissionSidebar = ({
    isSubmitting,
    onSubmit,
}: FeedbackSubmissionSidebarProps) => {
    const [type, setType] = useState<'suggestion' | 'bug'>('suggestion');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, type, is_anonymous: isAnonymous });
        // Reset form after submission if successful (handled by parent usually, but let's reset local state)
    };

    return (
        <Card className="p-6 h-fit sticky top-24 border-muted shadow-lg">
            <h2 className="text-xl font- mb-4">Suggest a feature or Report a bug</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex bg-muted/30 p-1 rounded-lg border gap-1">
                    <button
                        type="button"
                        onClick={() => setType('suggestion')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all text-sm font-medium",
                            type === 'suggestion' ? "bg-background text-green-600 shadow-sm border border-muted" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Zap className="w-4 h-4" />
                        Feature
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('bug')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all text-sm font-medium",
                            type === 'bug' ? "bg-background text-red-600 shadow-sm border border-muted" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Bug className="w-4 h-4" />
                        Bug
                    </button>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title" className="text-muted-foreground font-normal">Short, descriptive title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Add dark mode toggle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="border-muted focus-visible:ring-green-600"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-muted-foreground font-normal">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="I want to see..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="min-h-[150px] resize-none border-muted focus-visible:ring-green-600"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(!!checked)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <Label
                        htmlFor="anonymous"
                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                    >
                        Post anonymously
                    </Label>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font- h-11"
                >
                    {isSubmitting ? "Submitting..." : `Suggest ${type === 'suggestion' ? 'feature' : 'bug'}`}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground">
                    Found a bug? Send an email to <a href="mailto:yutilo.inc@gmail.com" className="text-blue-500 hover:underline">yutilo.inc@gmail.com</a>
                </p>
            </form>
        </Card>
    );
};
