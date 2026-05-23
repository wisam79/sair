-- Migration: 20260523000004_fix_conversations_schema.sql
-- Fix the unique constraint on conversations table and update get_or_create_conversation RPC to verify route subscription.

-- 1. Drop the old unique constraint (which was per-trip)
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_trip_id_key;

-- 2. Add a new unique constraint (per trip and student)
ALTER TABLE public.conversations ADD CONSTRAINT conversations_trip_student_unique UNIQUE (trip_id, student_id);

-- 3. Drop the old RPC overload
DROP FUNCTION IF EXISTS public.get_or_create_conversation(UUID);

-- 4. Create the updated RPC function
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_trip_id UUID,
  p_student_id UUID DEFAULT NULL
)
RETURNS public.conversations
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_trip public.trips%ROWTYPE;
  v_driver public.drivers%ROWTYPE;
  v_conversation public.conversations%ROWTYPE;
  v_caller_id UUID;
  v_target_student_id UUID;
  v_is_subscribed BOOLEAN;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO v_trip FROM public.trips WHERE id = p_trip_id;
  IF v_trip IS NULL THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE id = v_trip.driver_id;
  IF v_driver IS NULL THEN
    RAISE EXCEPTION 'Driver not found for this trip';
  END IF;

  -- Determine target student
  IF v_caller_id = v_driver.user_id THEN
    -- Driver is calling. They must specify which student they want to chat with.
    IF p_student_id IS NULL THEN
      RAISE EXCEPTION 'student_id is required when driver initiates chat';
    END IF;
    v_target_student_id := p_student_id;
  ELSE
    -- Student is calling. They can only create a conversation for themselves.
    IF p_student_id IS NOT NULL AND p_student_id != v_caller_id THEN
      RAISE EXCEPTION 'Unauthorized: student can only create conversations for themselves';
    END IF;
    v_target_student_id := v_caller_id;
  END IF;

  -- Verify subscription of the student to this route
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE student_id = v_target_student_id
      AND route_id = v_trip.route_id
      AND status IN ('active', 'pending')
  ) INTO v_is_subscribed;

  IF NOT v_is_subscribed THEN
    RAISE EXCEPTION 'Student is not subscribed to this trip route';
  END IF;

  -- Find existing conversation
  SELECT * INTO v_conversation
  FROM public.conversations
  WHERE trip_id = p_trip_id AND student_id = v_target_student_id;

  IF v_conversation IS NOT NULL THEN
    RETURN v_conversation;
  END IF;

  -- Create new conversation
  INSERT INTO public.conversations (trip_id, driver_id, student_id)
  VALUES (p_trip_id, v_trip.driver_id, v_target_student_id)
  RETURNING * INTO v_conversation;

  RETURN v_conversation;
END;
$$;

-- 5. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID, UUID) TO authenticated;
