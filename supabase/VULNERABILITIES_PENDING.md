# Sair Security Vulnerabilities - Pending & Fixed

## ⚠️ Vulnerability 1: Race Condition in complete_payment_and_activate_subscription

**Status:** PENDING FIX (ZainCash not yet active)
**Severity:** HIGH
**Date Found:** 2026-05-23

---

### Description

In `complete_payment_and_activate_subscription`, the seat is deducted from `routes.available_seats` BEFORE creating the subscription. If the subscription INSERT fails, the seat is NOT restored, causing lost seats and users paying without receiving service.

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

## ✅ Vulnerability 3: mark_messages_read - No Participant Verification

**Status:** FIXED (2026-05-25)
**Severity:** HIGH
**Migration:** `20260525000001_security_hardening_phase2.sql`

### Description

`mark_messages_read` was checking `auth.uid() IS NOT NULL` but NOT verifying the caller is a participant in the conversation. Any authenticated user could mark messages as read in any conversation by knowing the `conversation_id`.

### Fix

Added participant check: verify `caller_id = conversation.student_id OR caller_id IN (SELECT user_id FROM drivers WHERE id = conversation.driver_id)`.

---

## ✅ Vulnerability 4: Missing REVOKE EXECUTE FROM PUBLIC on Multiple RPCs

**Status:** FIXED (2026-05-25)
**Severity:** HIGH (Defense-in-Depth)
**Migration:** `20260525000001_security_hardening_phase2.sql`

### Description

Multiple RPCs lacked `REVOKE EXECUTE FROM PUBLIC`, allowing anon users to call them. While most checked `auth.uid()` internally and rejected NULL callers, this violates defense-in-depth and AGENTS.md requirements.

### Functions Fixed

| Function                     | Had Internal Auth Check          | Risk                                            |
| ---------------------------- | -------------------------------- | ----------------------------------------------- |
| `send_message`               | Yes                              | Anon could attempt calls (rejected internally)  |
| `get_messages`               | Yes                              | Anon could attempt calls (rejected internally)  |
| `mark_messages_read`         | Yes (but no participant check)   | See Vuln #3                                     |
| `get_my_conversations`       | Yes                              | Anon could attempt calls (rejected internally)  |
| `get_or_create_conversation` | Yes                              | Anon could attempt calls (rejected internally)  |
| `validate_trip_transition`   | No                               | Anon could probe trip states via error messages |
| `create_trip`                | Yes                              | Already had partial REVOKE                      |
| `admin_cancel_trip`          | Yes                              | Already had partial REVOKE                      |
| `admin_create_trip`          | Yes                              | Already had partial REVOKE                      |
| `get_my_role`                | No (returns caller's own role)   | Low risk                                        |
| `is_admin`                   | No (returns caller's own status) | Low risk                                        |
| `ping`                       | No (returns TRUE)                | No risk                                         |
| `get_analytics_summary`      | No                               | Could expose analytics data                     |

---

## ✅ Vulnerability 5: admin_cancel_trip Incorrectly Restores Seats

**Status:** FIXED (2026-05-25)
**Severity:** HIGH
**Migration:** `20260525000001_security_hardening_phase2.sql`

### Description

Per AGENTS.md: "المقاعد تتبع الاشتراك وليس الرحلة" (seats follow subscriptions, not trips). However, `admin_cancel_trip` was incrementing `available_seats + 1` when cancelling `scheduled` or `driver_waiting` trips. This is logically incorrect because:

1. Seats are decremented when a subscription is activated (`activate_license`)
2. Seats are incremented when a subscription is cancelled (`cancel_subscription`)
3. Trip cancellation should NOT affect seat counts

### Impact

- Seat count inflation: `available_seats` becomes inconsistent with actual active subscriptions
- Repeated create/cancel cycles by admin could inflate available_seats beyond capacity - 1
- Overbooking becomes possible

### Fix

Removed seat restoration from `admin_cancel_trip`. Seat management is now exclusively through subscription lifecycle functions.

---

## ✅ Vulnerability 6: notification_log INSERT with WITH CHECK (true)

**Status:** FIXED (2026-05-25)
**Severity:** MEDIUM
**Migration:** `20260525000001_security_hardening_phase2.sql`

### Description

The RLS policy for INSERT on `notification_log` used `WITH CHECK (true)`, allowing ANY user (including anon) to insert fake notifications into any user's notification feed. This violates AGENTS.md rule: "يمنع استخدام سياسات إدخال أو تعديل مفتوحة دائماً مثل `WITH CHECK (true)` للجداول الحساسة".

### Fix

Changed to `WITH CHECK (auth.role() = 'service_role' OR user_id = auth.uid())`.

---

## ✅ Vulnerability 7: cancel_subscription Fragile Auth Pattern

**Status:** FIXED (2026-05-25)
**Severity:** MEDIUM
**Migration:** `20260525000001_security_hardening_phase2.sql`

### Description

The auth check `IF auth.uid() IS NOT NULL AND v_sub.student_id != auth.uid() AND v_role != 'admin'` had a logic flaw: if `auth.uid()` is NULL, the entire condition evaluates to FALSE and the exception is NOT raised, allowing the operation to proceed. While currently protected by `REVOKE FROM PUBLIC`, this pattern is fragile and could be exploited if PUBLIC access is ever re-granted.

### Fix

Simplified to `IF v_sub.student_id != auth.uid() AND v_role != 'admin' THEN RAISE EXCEPTION ...`. Since `REVOKE FROM PUBLIC` ensures only authenticated users can call the function, `auth.uid()` will always be non-NULL.

---

## ✅ Vulnerability 8: emergency_reports INSERT Doesn't Validate Trip Participation

**Status:** FIXED (2026-05-25)
**Severity:** MEDIUM
**Migration:** `20260525000001_security_hardening_phase2.sql`

### Description

The RLS policy for INSERT on `emergency_reports` only checked `reporter_id = auth.uid()` but didn't validate that the user is a participant in the referenced trip. Any student could create emergency reports for trips they're not on, potentially triggering false alarms.

### Fix

Added check: student must have an active subscription on the trip's route, OR caller must be the driver of the trip.

---

## Summary Table

| #   | Vulnerability                                 | Status   | Severity | Migration             |
| --- | --------------------------------------------- | -------- | -------- | --------------------- |
| 1   | Race condition in complete_payment            | PENDING  | HIGH     | (ZainCash not active) |
| 2   | No rate limit on send_message                 | ✅ FIXED | HIGH     | 20260523000002        |
| 3   | mark_messages_read no participant check       | ✅ FIXED | HIGH     | 20260525000001        |
| 4   | Missing REVOKE FROM PUBLIC on RPCs            | ✅ FIXED | HIGH     | 20260525000001        |
| 5   | admin_cancel_trip seat restoration            | ✅ FIXED | HIGH     | 20260525000001        |
| 6   | notification_log INSERT WITH CHECK (true)     | ✅ FIXED | MEDIUM   | 20260525000001        |
| 7   | cancel_subscription fragile auth pattern      | ✅ FIXED | MEDIUM   | 20260525000001        |
| 8   | emergency_reports no trip participation check | ✅ FIXED | MEDIUM   | 20260525000001        |
