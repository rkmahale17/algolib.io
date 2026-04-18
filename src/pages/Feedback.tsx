"use client";
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackCard } from '@/components/feedback/FeedbackCard';
import { FeedbackFilters } from '@/components/feedback/FeedbackFilters';
import { FeedbackSubmissionSidebar } from '@/components/feedback/FeedbackSubmissionSidebar';
import { FeedbackDetailModal } from '@/components/feedback/FeedbackDetailModal';
import { usePostHog } from '@posthog/react';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  type: 'suggestion' | 'bug';
  status: string;
  upvotes_count: number;
  is_anonymous: boolean;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
  has_voted: boolean;
  comments_count: number;
}

const Feedback = () => {
  const posthog = usePostHog();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'suggestions' | 'bugs'>('all');
  const [activeSort, setActiveSort] = useState<'hot' | 'top' | 'new'>('hot');
  const [counts, setCounts] = useState({ all: 0, suggestions: 0, bugs: 0 });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal state
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    };

    getSession();
  }, []);

  const fetchFeedback = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    try {
      // Fetch all items to calculate counts correctly
      let query = supabase
        .from('feedback')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          votes:feedback_votes (user_id),
          comments:feedback_comments (id)
        `);

      const { data: allData, error: allErr } = await query;
      if (allErr) throw allErr;

      const suggCount = (allData as any[]).filter(i => i.type === 'suggestion').length;
      const bugCount = (allData as any[]).filter(i => i.type === 'bug').length;
      setCounts({
        all: (allData as any[]).length,
        suggestions: suggCount,
        bugs: bugCount
      });

      // Now apply filters for display
      let displayQuery = supabase
        .from('feedback')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          votes:feedback_votes (user_id),
          comments:feedback_comments (id)
        `);

      if (activeTab === 'suggestions') {
        displayQuery = displayQuery.eq('type', 'suggestion');
      } else if (activeTab === 'bugs') {
        displayQuery = displayQuery.eq('type', 'bug');
      }

      // Sort logic
      if (activeSort === 'new') {
        displayQuery = displayQuery.order('created_at', { ascending: false });
      } else if (activeSort === 'top') {
        displayQuery = displayQuery.order('upvotes_count', { ascending: false });
      } else if (activeSort === 'hot') {
        displayQuery = displayQuery.order('upvotes_count', { ascending: false }).order('created_at', { ascending: false });
      }

      const { data, error } = await displayQuery;

      if (error) throw error;

      const formattedData = (data as any[]).map(item => ({
        ...item,
        has_voted: item.votes?.some((v: any) => v.user_id === currentUser?.id),
        comments_count: item.comments?.length || 0
      }));

      setItems(formattedData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeSort, currentUser?.id]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleVote = async (feedbackId: string) => {
    if (!currentUser) {
      toast.error('Please login to upvote');
      return;
    }

    const item = items.find(i => i.id === feedbackId);
    if (!item) return;

    try {
      if (item.has_voted) {
        // Remove vote
        const { error } = await supabase
          .from('feedback_votes')
          .delete()
          .match({ feedback_id: feedbackId, user_id: currentUser.id });

        if (error) throw error;
      } else {
        // Add vote
        const { error } = await supabase
          .from('feedback_votes')
          .insert({ feedback_id: feedbackId, user_id: currentUser.id });

        if (error) throw error;
      }

      // Update local state for immediate feedback
      setItems(prev => prev.map(i => {
        if (i.id === feedbackId) {
          return {
            ...i,
            has_voted: !i.has_voted,
            upvotes_count: i.has_voted ? Math.max(0, i.upvotes_count - 1) : i.upvotes_count + 1
          };
        }
        return i;
      }));

      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback(prev => prev ? {
          ...prev,
          has_voted: !prev.has_voted,
          upvotes_count: prev.has_voted ? Math.max(0, prev.upvotes_count - 1) : prev.upvotes_count + 1
        } : null);
      }

    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to update vote');
    }
  };

  const handleSubmitFeedback = async (data: { title: string; description: string; type: 'suggestion' | 'bug'; is_anonymous: boolean }) => {
    if (!currentUser) {
      toast.error('Please login to submit feedback');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          ...data,
          user_id: currentUser.id,
          status: 'pending'
        });

      if (error) throw error;

      posthog?.capture('feedback_submitted', { type: data.type, is_anonymous: data.is_anonymous });
      toast.success('Feedback submitted successfully!');
      fetchFeedback();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDetail = async (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('feedback_id', feedback.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data.map(c => ({
        ...c,
        user_full_name: c.profiles?.full_name || 'User'
      })));
    } catch (error) {
      console.error('Comments fetch error:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (content: string, isAnonymous: boolean) => {
    if (!currentUser || !selectedFeedback) {
      toast.error('Please login to comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .insert({
          feedback_id: selectedFeedback.id,
          user_id: currentUser.id,
          content,
          is_anonymous: isAnonymous
        })
        .select('*, profiles:user_id(full_name, avatar_url)')
        .single();

      if (error) throw error;

      const newComment = {
        ...data,
        user_full_name: data.profiles?.full_name || 'User'
      };

      setComments(prev => [...prev, newComment]);

      // Update comment count in main list
      setItems(prev => prev.map(i => {
        if (i.id === selectedFeedback.id) {
          return { ...i, comments_count: i.comments_count + 1 };
        }
        return i;
      }));

      // Update comment count in selected feedback
      setSelectedFeedback(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null);

      toast.success('Comment added');
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback & Suggestions - Rulcode.com | Report Bugs & Request Features</title>
        <meta
          name="description"
          content="Share your feedback, report bugs, or request new features for Rulcode.com. Help us improve our free algorithm learning platform."
        />
        <link rel="canonical" href="https://rulcode.com/feedback" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-extra mb-6 tracking-tight">
                Suggest a <span className="text-green-600 bg-green-50 px-2 rounded-lg">feature</span> or Report <br className="hidden md:block" /> a <span className="text-green-600 bg-green-50 px-2 rounded-lg">bug</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Help us shape the future of Rulcode. Your ideas matter. Found <br className="hidden md:block" /> an issue? Let us know so we can fix it.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <FeedbackFilters
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  activeSort={activeSort}
                  setActiveSort={setActiveSort}
                  counts={counts}
                />

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading feedback...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-muted-foreground">No feedback found</h3>
                    <p className="text-sm text-muted-foreground/60">Be the first to suggest something!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <FeedbackCard
                        key={item.id}
                        {...item}
                        user_full_name={item.profiles?.full_name}
                        user_avatar={item.profiles?.avatar_url}
                        onVote={() => handleVote(item.id)}
                        onClick={() => handleOpenDetail(item)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <FeedbackSubmissionSidebar
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitFeedback}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <FeedbackDetailModal
        isOpen={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        feedback={selectedFeedback}
        comments={comments}
        isSubmittingComment={isSubmittingComment}
        onVote={handleVote}
        onAddComment={handleAddComment}
      />
    </>
  );
};

export default Feedback;
