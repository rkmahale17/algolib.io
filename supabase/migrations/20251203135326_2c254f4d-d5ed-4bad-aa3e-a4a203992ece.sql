-- Migrate whiteboard data from user_whiteboards to user_algorithm_data
-- For users/algorithms that already exist, update the whiteboard_data
UPDATE public.user_algorithm_data uad
SET whiteboard_data = (
  SELECT jsonb_build_object(
    'title', uw.title,
    'board_json', uw.board_json,
    'migrated_at', NOW()
  )
  FROM public.user_whiteboards uw
  WHERE uw.user_id = uad.user_id 
    AND uw.algorithm_id = uad.algorithm_id
  ORDER BY uw.updated_at DESC
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM public.user_whiteboards uw
  WHERE uw.user_id = uad.user_id AND uw.algorithm_id = uad.algorithm_id
);

-- Insert whiteboard data for user/algorithm combinations that don't exist yet
INSERT INTO public.user_algorithm_data (user_id, algorithm_id, whiteboard_data, created_at, updated_at)
SELECT DISTINCT ON (uw.user_id, uw.algorithm_id)
  uw.user_id,
  uw.algorithm_id,
  jsonb_build_object(
    'title', uw.title,
    'board_json', uw.board_json,
    'migrated_at', NOW()
  ),
  uw.created_at,
  uw.updated_at
FROM public.user_whiteboards uw
WHERE uw.algorithm_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.user_algorithm_data uad
    WHERE uad.user_id = uw.user_id AND uad.algorithm_id = uw.algorithm_id
  )
ORDER BY uw.user_id, uw.algorithm_id, uw.updated_at DESC
ON CONFLICT (user_id, algorithm_id) DO NOTHING;

-- Migrate notes data from user_notes to user_algorithm_data
-- For users/algorithms that already exist, update the notes
UPDATE public.user_algorithm_data uad
SET notes = (
  SELECT CONCAT(un.title, E'\n\n', un.notes_text)
  FROM public.user_notes un
  WHERE un.user_id = uad.user_id 
    AND un.algorithm_id = uad.algorithm_id
  ORDER BY un.updated_at DESC
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM public.user_notes un
  WHERE un.user_id = uad.user_id AND un.algorithm_id = uad.algorithm_id
);

-- Insert notes data for user/algorithm combinations that don't exist yet
INSERT INTO public.user_algorithm_data (user_id, algorithm_id, notes, created_at, updated_at)
SELECT DISTINCT ON (un.user_id, un.algorithm_id)
  un.user_id,
  un.algorithm_id,
  CONCAT(un.title, E'\n\n', un.notes_text),
  un.created_at,
  un.updated_at
FROM public.user_notes un
WHERE un.algorithm_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.user_algorithm_data uad
    WHERE uad.user_id = un.user_id AND uad.algorithm_id = un.algorithm_id
  )
ORDER BY un.user_id, un.algorithm_id, un.updated_at DESC
ON CONFLICT (user_id, algorithm_id) DO NOTHING;