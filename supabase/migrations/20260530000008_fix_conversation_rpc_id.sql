-- =================================================================
-- Migration: 20260530000008_fix_conversation_rpc_id.sql
-- Rename conversation_id column to id in get_or_create_conversation
-- to match client expectations and mobile models.
-- =================================================================

-- Drop the old function first because we're changing the return table structure
DROP FUNCTION IF EXISTS public.get_or_create_conversation(UUID);

-- Recreate with column named 'id'
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_trip_id UUID)
RETURNS TABLE(
  id              UUID,
  student_id      UUID,
  driver_id       UUID,
  route_id        UUID,
  created_at      TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_trip_route_id  UUID;
  v_driver_user_id UUID;
  v_caller_id      UUID := auth.uid();
  v_role           TEXT := get_my_role();
  v_conv_id        UUID;
BEGIN
  -- Fetch trip info
  SELECT t.route_id, d.user_id
    INTO v_trip_route_id, v_driver_user_id
  FROM trips t
  JOIN drivers d ON d.id = t.driver_id
  WHERE t.id = p_trip_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  -- Verify caller is subscribed to this trip route (for students)
  IF v_role = 'student' THEN
    IF NOT EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.student_id = v_caller_id
        AND s.route_id   = v_trip_route_id
        AND s.status IN ('active', 'pending')
    ) THEN
      RAISE EXCEPTION 'Student is not subscribed to this trip route';
    END IF;

    -- Find or create conversation
    SELECT c.id INTO v_conv_id
    FROM conversations c
    WHERE c.student_id = v_caller_id
      AND c.driver_id  = v_driver_user_id
      AND c.route_id   = v_trip_route_id
    LIMIT 1;

    IF v_conv_id IS NULL THEN
      INSERT INTO conversations (student_id, driver_id, route_id)
      VALUES (v_caller_id, v_driver_user_id, v_trip_route_id)
      RETURNING id INTO v_conv_id;
    END IF;

  ELSIF v_role = 'driver' THEN
    IF v_caller_id != v_driver_user_id THEN
      RAISE EXCEPTION 'Not authorized: not your trip';
    END IF;
    RAISE EXCEPTION 'Driver conversation access not implemented yet';
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
    SELECT c.id, c.student_id, c.driver_id, c.route_id, c.created_at
    FROM conversations c
    WHERE c.id = v_conv_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) TO authenticated, service_role;
