-- Update handle_new_user function to auto-generate username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base username from full name or email
  IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    -- Remove spaces, convert to lowercase, take first 15 chars
    base_username := lower(regexp_replace(
      substring(NEW.raw_user_meta_data->>'full_name', 1, 15),
      '[^a-zA-Z0-9]', '', 'g'
    ));
  ELSE
    -- Use part of email if no name provided
    base_username := lower(split_part(NEW.email, '@', 1));
  END IF;
  
  -- Ensure we have at least something
  IF base_username = '' OR base_username IS NULL THEN
    base_username := 'user';
  END IF;
  
  -- Add random suffix to make it unique
  final_username := 'user_' || base_username || '_' || floor(random() * 10000)::text;
  
  -- Ensure uniqueness (retry if collision)
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := 'user_' || base_username || '_' || floor(random() * 10000)::text;
    
    -- Prevent infinite loop
    IF counter > 10 THEN
      final_username := 'user_' || gen_random_uuid()::text;
      EXIT;
    END IF;
  END LOOP;
  
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    final_username
  );
  RETURN NEW;
END;
$$;