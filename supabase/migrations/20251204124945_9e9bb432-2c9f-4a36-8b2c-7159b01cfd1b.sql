-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback (public form)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view all feedback
CREATE POLICY "Admins can view all feedback" 
ON public.feedback 
FOR SELECT 
USING (public.is_algorithms_admin());

-- Only admins can update feedback
CREATE POLICY "Admins can update feedback" 
ON public.feedback 
FOR UPDATE 
USING (public.is_algorithms_admin());

-- Only admins can delete feedback
CREATE POLICY "Admins can delete feedback" 
ON public.feedback 
FOR DELETE 
USING (public.is_algorithms_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for feedback images
INSERT INTO storage.buckets (id, name, public) VALUES ('feedback-images', 'feedback-images', true);

-- Storage policies for feedback images
CREATE POLICY "Anyone can upload feedback images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'feedback-images');

CREATE POLICY "Anyone can view feedback images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'feedback-images');

CREATE POLICY "Admins can delete feedback images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'feedback-images' AND public.is_algorithms_admin());