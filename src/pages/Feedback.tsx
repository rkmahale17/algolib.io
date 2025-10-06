import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageSquare, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const Feedback = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create GitHub issue URL with pre-filled data
      const issueTitle = encodeURIComponent(title);
      const issueBody = encodeURIComponent(description);
      const githubIssueUrl = `https://github.com/yourusername/yourrepo/issues/new?title=${issueTitle}&body=${issueBody}`;
      
      // Open in new tab
      window.open(githubIssueUrl, '_blank');
      
      toast.success('Opening GitHub to submit your feedback!');
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to open feedback form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">We Value Your Input</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Feedback & Suggestions</h1>
            <p className="text-muted-foreground">
              Help us improve AlgoLearn by sharing your feedback, bug reports, or feature requests.
            </p>
          </div>

          <Card className="p-6 glass-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your feedback"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed feedback, bug reports, or feature requests..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('https://github.com/yourusername/yourrepo/issues', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Your feedback will be submitted as a GitHub issue. You may need to sign in to GitHub.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
