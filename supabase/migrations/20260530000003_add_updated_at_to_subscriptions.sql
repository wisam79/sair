-- Add updated_at column to subscriptions table to fix database trigger crash
-- when updating subscription status.
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
