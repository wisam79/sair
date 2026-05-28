-- Migration: 20260524000003_fix_get_my_conversations_ambiguous_column.sql
-- Fix get_my_conversations RPC to resolve ambiguous column 'created_at' in messages subquery.

-- 1. Drop the function first to allow signature and return type update if needed (clean state)
DROP FUNCTION IF EXISTS public.get_my_conversations();

-- 2. Create the updated function with public.messages.created_at explicitly qualified
CREATE OR REPLACE FUNCTION public.get_my_conversations()
RETURNS TABLE (
  id UUID,
  trip_id UUID,
  driver_id UUID,
  student_id UUID,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  driver_name TEXT,
  student_name TEXT,
  last_message TEXT,
  unread_count INT
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT 
    c.id,
    c.trip_id,
    c.driver_id,
    c.student_id,
    c.last_message_at,
    c.created_at,
    c.updated_at,
    COALESCE(dp.full_name, '')::TEXT AS driver_name,
    COALESCE(sp.full_name, '')::TEXT AS student_name,
    (
      SELECT content FROM public.messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    )::TEXT AS last_message,
    COALESCE((
      SELECT COUNT(*)::INT FROM public.messages m2
      WHERE m2.conversation_id = c.id
        AND m2.sender_id != v_caller_id
        AND m2.is_read = false
    ), 0)::INT AS unread_count
  FROM public.conversations c
  LEFT JOIN public.drivers d ON c.driver_id = d.id
  LEFT JOIN public.profiles dp ON d.user_id = dp.id
  LEFT JOIN public.profiles sp ON c.student_id = sp.id
  WHERE
    d.user_id = v_caller_id
    OR c.student_id = v_caller_id
  ORDER BY c.last_message_at DESC;
END;
$$;

-- 3. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_conversations() TO authenticated;
