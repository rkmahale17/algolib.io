-- Seed the youtube_video feature flag
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.feature_flags WHERE key = 'youtube_video') THEN
        INSERT INTO public.feature_flags (key, description, is_enabled)
        VALUES ('youtube_video', 'Enables the YouTube video tutorial section on algorithm detail pages.', true);
    END IF;
END $$;
