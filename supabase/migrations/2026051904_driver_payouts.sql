-- UniRide v2 M8: Driver Payouts Table
-- Migration: 2026051904_driver_payouts.sql

-- ════════════════════════════════════════════════
-- 1. Driver Payouts table
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS driver_payouts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id      UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  amount         NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  reference_note TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE driver_payouts ENABLE ROW LEVEL SECURITY;

-- Drivers can view their own payouts
CREATE POLICY "Drivers see own payouts"
  ON driver_payouts FOR SELECT
  USING (
    driver_id IN (
      SELECT d.id FROM drivers d WHERE d.user_id = auth.uid()
    )
  );

-- Admins can view and manage all payouts
CREATE POLICY "Admins manage all payouts"
  ON driver_payouts FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_driver_payouts_driver_id ON driver_payouts(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_payouts_status ON driver_payouts(status);
CREATE INDEX IF NOT EXISTS idx_driver_payouts_created_at ON driver_payouts(created_at DESC);

-- ════════════════════════════════════════════════
-- 2. RPC: Update payout status (admin only)
-- ════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_payout_status(
  p_payout_id UUID,
  p_new_status TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payout RECORD;
  v_role TEXT;
BEGIN
  v_role := auth.jwt() -> 'app_metadata' ->> 'role';

  IF v_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;

  IF p_new_status NOT IN ('completed', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  SELECT * INTO v_payout
  FROM driver_payouts
  WHERE id = p_payout_id
  FOR UPDATE NOWAIT;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payout not found';
  END IF;

  IF v_payout.status != 'pending' THEN
    RAISE EXCEPTION 'Cannot update payout with status: %', v_payout.status;
  END IF;

  UPDATE driver_payouts
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_payout_id;

  INSERT INTO audit_logs (user_id, action, resource, resource_id, details)
  VALUES (
    auth.uid(),
    'update_payout_status',
    'driver_payouts',
    p_payout_id,
    jsonb_build_object('previous_status', v_payout.status, 'new_status', p_new_status)
  );

  RETURN jsonb_build_object(
    'id', v_payout.id,
    'status', p_new_status,
    'updated_at', NOW()
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION update_payout_status(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_payout_status(UUID, TEXT) TO authenticated;
