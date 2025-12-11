import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { Link } from 'react-router-dom'; // Added Link
import { ExternalLink, Loader2, MessageSquare, Trash2, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  user_email: string | null;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', icon: Clock, variant: 'secondary' },
  in_progress: { label: 'In Progress', icon: Loader2, variant: 'default' },
  resolved: { label: 'Resolved', icon: CheckCircle, variant: 'outline' },
  rejected: { label: 'Rejected', icon: XCircle, variant: 'destructive' },
};

const FeedbackAdmin = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchFeedback = async () => {
    if (!supabase) {
      toast.error('Database not available');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } else {
      setFeedback(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!supabase) return;
    
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete feedback');
    } else {
      toast.success('Feedback deleted');
      setFeedback(prev => prev.filter(f => f.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Feedback Management - AlgoLib.io</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
               <Link to="/admin">
                    <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
               </Link>
               <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    Feedback Management
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {feedback.length} feedback submission{feedback.length !== 1 ? 's' : ''}
                  </p>
               </div>
            </div>
          </div>

          {feedback.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No feedback yet</h3>
              <p className="text-muted-foreground">Feedback submissions will appear here</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {feedback.map((item) => {
                const StatusIcon = statusConfig[item.status]?.icon || Clock;
                return (
                  <Card key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {item.image_url && (
                        <button
                          onClick={() => setSelectedImage(item.image_url)}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image_url}
                            alt="Feedback screenshot"
                            className="w-32 h-24 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                          />
                        </button>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                          <Badge variant={statusConfig[item.status]?.variant || 'secondary'}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[item.status]?.label || item.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground whitespace-pre-wrap mb-3">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}</span>
                          {item.user_email && (
                            <a 
                              href={`mailto:${item.user_email}`}
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              {item.user_email}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Select
                          value={item.status}
                          onValueChange={(value) => updateStatus(item.id, value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteFeedback(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        <Footer />
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Screenshot</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img src={selectedImage} alt="Full screenshot" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackAdmin;
