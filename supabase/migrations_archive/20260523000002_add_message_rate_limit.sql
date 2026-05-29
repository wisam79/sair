-- Migration: 20260523000002_add_message_rate_limit.sql
-- Fix: Add rate limiting to send_message to prevent spam/flood attacks
-- Issue: No rate limit existed on send_message, allowing participants to send
--        unlimited messages and cause DoS through notification flood

CREATE OR REPLACE FUNCTION public.send_message(p_conversation_id UUID, p_content TEXT)
RETURNS messages
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_message messages%ROWTYPE;
  v_conversation conversations%ROWTYPE;
  v_caller_id UUID;
  v_rate_limit_ok BOOLEAN;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Rate limiting check: 30 messages per minute per user
  SELECT COALESCE(check_rate_limit(v_caller_id, 'send_message', 30, 60), false)
  INTO v_rate_limit_ok;

  IF NOT v_rate_limit_ok THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please slow down.';
  END IF;

  SELECT * INTO v_conversation FROM conversations WHERE id = p_conversation_id;
  IF v_conversation IS NULL THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  IF v_caller_id NOT IN (
    SELECT user_id FROM drivers WHERE id = v_conversation.driver_id
  ) AND v_caller_id != v_conversation.student_id THEN
    RAISE EXCEPTION 'Not a participant in this conversation';
  END IF;

  INSERT INTO messages (conversation_id, sender_id, content)
  VALUES (p_conversation_id, v_caller_id, p_content)
  RETURNING * INTO v_message;

  UPDATE conversations SET last_message_at = NOW() WHERE id = p_conversation_id;

  RETURN v_message;
END;
$$;

-- Grant still open for authenticated users
GRANT EXECUTE ON FUNCTION public.send_message(UUID, TEXT) TO authenticated;