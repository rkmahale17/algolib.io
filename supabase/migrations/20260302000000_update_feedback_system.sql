-- Update feedback table to support categories, upvotes, and anonymity
ALTER TABLE public.feedback 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'suggestion' CHECK (type IN ('suggestion', 'bug')),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS upvotes_count INTEGER DEFAULT 0;

-- Create feedback_votes table for tracking user upvotes
CREATE TABLE IF NOT EXISTS public.feedback_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feedback_id UUID NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, feedback_id)
);

-- Enable RLS for feedback_votes
ALTER TABLE public.feedback_votes ENABLE ROW LEVEL SECURITY;

-- feedback_votes policies
CREATE POLICY "Users can view all votes" ON public.feedback_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.feedback_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own vote" ON public.feedback_votes FOR DELETE USING (auth.uid() = user_id);

-- Create feedback_comments table
CREATE TABLE IF NOT EXISTS public.feedback_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID NOT NULL REFERENCES public.feedback(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for feedback_comments
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

-- feedback_comments policies
CREATE POLICY "Anyone can view comments" ON public.feedback_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.feedback_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.feedback_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.feedback_comments FOR DELETE USING (auth.uid() = user_id);

-- Create a function to increment upvotes_count
CREATE OR REPLACE FUNCTION public.handle_feedback_vote()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.feedback SET upvotes_count = upvotes_count + 1 WHERE id = NEW.feedback_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.feedback SET upvotes_count = upvotes_count - 1 WHERE id = OLD.feedback_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for handling upvotes_count
CREATE TRIGGER on_feedback_vote_change
AFTER INSERT OR DELETE ON public.feedback_votes
FOR EACH ROW EXECUTE FUNCTION public.handle_feedback_vote();
