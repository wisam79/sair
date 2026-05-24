# Sair Security Vulnerabilities - Pending Fixes

## ⚠️ Vulnerability 1: Race Condition in complete_payment_and_activate_subscription

**Status:** PENDING FIX (ZainCash not yet active)
**Severity:** HIGH
**Date Found:** 2026-05-23

---

### Description

In `complete_payment_and_activate_subscription`, the seat is deducted from `routes.available_seats` BEFORE creating the subscription. If the subscription INSERT fails, the seat is NOT restored, causing lost seats and users paying without receiving service.

### Current Vulnerable Code (DB)

```sql
-- Seat is deducted FIRST
UPDATE routes
SET available_seats = available_seats - 1
WHERE id = v_payment.route_id AND available_seats > 0 AND is_active = true;

IF NOT FOUND THEN
  UPDATE payments SET status = 'failed'...;
  RETURN v_payment;  -- EXIT but seat already deducted!
END IF;

-- Subscription creation can FAIL here!
INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date, purchase_price)
VALUES (...);

UPDATE payments SET status = 'completed'...;
```

### Impact

- Lost seats (seat deducted but no subscription created)
- Users pay but don't receive service
- Direct financial loss

### Required Fix

Reverse the order: Create subscription FIRST, then deduct seat. Use proper transaction handling with EXCEPTION block to restore seat on failure.

### TODO When Activating ZainCash

1. Review the `complete_payment_and_activate_subscription` function
2. Ensure subscription is created BEFORE seat is deducted
3. Add proper EXCEPTION handling to restore seat on any failure
4. Consider using CTE for atomicity

---

## ✅ Vulnerability 2: No Rate Limit on send_message

**Status:** FIXED (2026-05-23)
**Migration:** `20260523000002_add_message_rate_limit.sql`

Added rate limiting: 30 messages per minute per user via `check_rate_limit('send_message', 30, 60)`.

---

## Summary Table

| #   | Vulnerability                      | Status   | Notes                          |
| --- | ---------------------------------- | -------- | ------------------------------ |
| 1   | Race condition in complete_payment | PENDING  | Fix before ZainCash activation |
| 2   | No rate limit on send_message      | ✅ FIXED | 30 msg/min limit added         |
