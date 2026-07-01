-- Create visualization_feedback table
CREATE TABLE IF NOT EXISTS public.visualization_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    algorithm_id TEXT NOT NULL REFERENCES public.algorithms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_checkboxes JSONB NOT NULL DEFAULT '[]'::jsonb,
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.visualization_feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow anyone to insert visualization feedback" 
    ON public.visualization_feedback 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can view their own visualization feedback"
    ON public.visualization_feedback
    FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
