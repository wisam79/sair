-- UniRide M9: Driver-Student Messaging System
-- Conversations and messages between drivers and students

-- Conversations: one per trip between driver and student
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_driver_id ON conversations(driver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_trip_id ON conversations(trip_id);

-- Messages: individual chat messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- RLS policies - simplified
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users see their own conversations
CREATE POLICY "Conversations: Participants see their conversations"
  ON conversations FOR SELECT
  USING (
    auth.uid() = student_id
    OR auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
  );

-- Drivers and students can create conversations for their trips
CREATE POLICY "Conversations: Driver can create for their trips"
  ON conversations FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    OR auth.uid() IN (SELECT user_id FROM drivers WHERE id = conversations.driver_id)
  );

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Messages: participants can read messages in their conversations
-- Uses a join to check participation (avoids cross-database reference in subquery)
CREATE POLICY "Messages: Conversation participants can read"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (
        c.student_id = auth.uid()
        OR c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
      )
    )
  );

-- Messages: participants can insert into their conversations
CREATE POLICY "Messages: Conversation participants can send"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (
        c.student_id = auth.uid()
        OR c.driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
      )
    )
  );

-- Messages: only sender can update (mark as read)
CREATE POLICY "Messages: Sender can update read status"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- RPC: Get or create conversation for a trip
CREATE OR REPLACE FUNCTION get_or_create_conversation(p_trip_id UUID)
RETURNS conversations AS $$
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

  IF v_caller_id != v_driver.user_id AND v_caller_id != v_trip.student_id THEN
    RAISE EXCEPTION 'Not a participant in this trip';
  END IF;

  SELECT * INTO v_conversation
  FROM conversations
  WHERE trip_id = p_trip_id;

  IF v_conversation IS NOT NULL THEN
    RETURN v_conversation;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Send a message
CREATE OR REPLACE FUNCTION send_message(p_conversation_id UUID, p_content TEXT)
RETURNS messages AS $$
DECLARE
  v_message messages%ROWTYPE;
  v_conversation conversations%ROWTYPE;
  v_caller_id UUID;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Get messages for a conversation
CREATE OR REPLACE FUNCTION get_messages(p_conversation_id UUID, p_limit INT DEFAULT 50)
RETURNS SETOF messages AS $$
DECLARE
  v_conversation conversations%ROWTYPE;
  v_caller_id UUID;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT * INTO v_conversation FROM conversations WHERE id = p_conversation_id;
  IF v_conversation IS NULL THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  IF v_caller_id NOT IN (
    SELECT user_id FROM drivers WHERE id = v_conversation.driver_id
  ) AND v_caller_id != v_conversation.student_id THEN
    RAISE EXCEPTION 'Not a participant';
  END IF;

  RETURN QUERY
  SELECT * FROM messages
  WHERE conversation_id = p_conversation_id
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Get user's conversations (driver or student)
CREATE OR REPLACE FUNCTION get_my_conversations()
RETURNS SETOF conversations AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT * FROM conversations c
  WHERE
    c.driver_id IN (SELECT id FROM drivers WHERE user_id = v_caller_id)
    OR c.student_id = v_caller_id
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(p_conversation_id UUID)
RETURNS void AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  SELECT auth.uid() INTO v_caller_id;
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE messages
  SET is_read = true
  WHERE conversation_id = p_conversation_id
    AND sender_id != v_caller_id
    AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;