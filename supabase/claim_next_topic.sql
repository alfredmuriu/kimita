-- Run this in the Supabase SQL Editor to create the atomic topic claim function.
-- This function selects the next unused topic AND marks it as used in a single
-- atomic transaction, preventing race conditions where two requests could pick
-- the same topic.

CREATE OR REPLACE FUNCTION claim_next_topic()
RETURNS TABLE (
  id uuid,
  topic text,
  category text,
  primary_keyword text,
  secondary_keywords text[],
  used boolean,
  priority int,
  created_at timestamptz
)
LANGUAGE plpgsql
AS $$
DECLARE
  claimed_id uuid;
BEGIN
  -- Atomically find and lock the next unused topic
  SELECT bt.id INTO claimed_id
  FROM blog_topics bt
  WHERE bt.used = false
  ORDER BY bt.priority ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- If no unused topic found, return empty
  IF claimed_id IS NULL THEN
    RETURN;
  END IF;

  -- Mark it as used
  UPDATE blog_topics SET used = true WHERE blog_topics.id = claimed_id;

  -- Return the full topic row
  RETURN QUERY
    SELECT bt.id, bt.topic, bt.category, bt.primary_keyword,
           bt.secondary_keywords, bt.used, bt.priority, bt.created_at
    FROM blog_topics bt
    WHERE bt.id = claimed_id;
END;
$$;
