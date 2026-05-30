-- Add subscription_id reference to payments table to allow linking completed payments
-- with their activated subscriptions.
ALTER TABLE public.payments 
  ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL;
