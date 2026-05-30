-- =================================================================
-- Migration: 20260530000010_fix_prod_function_signatures.sql
-- Drop functions with mismatched return types before restore_missing_rpcs
-- redefines them. This is needed because PostgreSQL does not allow
-- changing the return type of an existing function with CREATE OR REPLACE.
-- =================================================================

-- Drop update_payout_status (production has it returning void, new version returns JSONB)
DROP FUNCTION IF EXISTS public.update_payout_status(UUID, TEXT);

-- Recreate update_payout_status returning JSONB (matches migration 000005)
CREATE OR REPLACE FUNCTION public.update_payout_status(
  p_payout_id  UUID,
  p_new_status TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_payout RECORD;
BEGIN
  IF get_my_role() != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;

  SELECT * INTO v_payout
  FROM driver_payouts
  WHERE id = p_payout_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payout not found';
  END IF;

  IF v_payout.status NOT IN ('pending') THEN
    RAISE EXCEPTION 'Cannot update payout with status %', v_payout.status;
  END IF;

  IF p_new_status NOT IN ('completed', 'rejected') THEN
    RAISE EXCEPTION 'Invalid payout status: %', p_new_status;
  END IF;

  UPDATE driver_payouts
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_payout_id;

  RETURN (SELECT row_to_json(d)::JSONB FROM driver_payouts d WHERE id = p_payout_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_payout_status(UUID, TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.update_payout_status(UUID, TEXT) TO authenticated, service_role;
