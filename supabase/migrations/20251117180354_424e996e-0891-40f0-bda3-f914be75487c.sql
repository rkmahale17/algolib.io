-- Create user_whiteboards table
CREATE TABLE public.user_whiteboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Whiteboard',
  board_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_notes table
CREATE TABLE public.user_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  notes_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_whiteboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user_whiteboards
CREATE POLICY "Users can view own whiteboards"
ON public.user_whiteboards
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own whiteboards"
ON public.user_whiteboards
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own whiteboards"
ON public.user_whiteboards
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own whiteboards"
ON public.user_whiteboards
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for user_notes
CREATE POLICY "Users can view own notes"
ON public.user_notes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
ON public.user_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
ON public.user_notes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
ON public.user_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_whiteboards_updated_at
BEFORE UPDATE ON public.user_whiteboards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_notes_updated_at
BEFORE UPDATE ON public.user_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();