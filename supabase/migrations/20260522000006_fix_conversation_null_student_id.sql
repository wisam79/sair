-- Migration: 20260522000006_fix_conversation_null_student_id.sql
-- Fix NULL handling in get_or_create_conversation to prevent:
-- 1. NULL comparisons that always evaluate to NULL (not TRUE/FALSE)
-- 2. Creating conversations with NULL student_id

CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_trip_id UUID)
RETURNS conversations
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_trip trips%ROWTYPE;
  v_driver drivers%ROWTYPE;
  v_conversation conversations%ROWTYPE;
  v_caller_id UUID;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO v_trip FROM trips WHERE id = p_trip_id;
  IF v_trip IS NULL THEN
    RAISE EXCEPTION 'Trip not found';
  END IF;

  SELECT * INTO v_driver FROM drivers WHERE id = v_trip.driver_id;

  -- Explicit NULL-safe comparison
  -- Old: v_caller_id != v_driver.user_id AND v_caller_id != v_trip.student_id
  -- Problem: NULL != anything returns NULL, not FALSE
  IF v_caller_id != v_driver.user_id
     AND (v_trip.student_id IS NULL OR v_caller_id != v_trip.student_id) THEN
    RAISE EXCEPTION 'Not a participant in this trip';
  END IF;

  SELECT * INTO v_conversation
  FROM conversations
  WHERE trip_id = p_trip_id;

  IF v_conversation IS NOT NULL THEN
    RETURN v_conversation;
  END IF;

  -- Prevent creating conversation with NULL student_id
  IF v_trip.student_id IS NULL THEN
    RAISE EXCEPTION 'Cannot create conversation: trip has no assigned student';
  END IF;

  IF v_caller_id = v_driver.user_id THEN
    INSERT INTO conversations (trip_id, driver_id, student_id)
    VALUES (p_trip_id, v_trip.driver_id, v_trip.student_id)
    RETURNING * INTO v_conversation;
  ELSE
    INSERT INTO conversations (trip_id, driver_id, student_id)
    VALUES (p_trip_id, v_trip.driver_id, v_caller_id)
    RETURNING * INTO v_conversation;
  END IF;

  RETURN v_conversation;
END;
$$;