# Sair v2 - API & Functions Reference 📡

This document acts as the technical reference for the Supabase Edge Functions and PostgreSQL Stored Procedures (RPCs) powering Sair v2.

---

## 1. Supabase Edge Functions

All edge functions are hosted on Deno and can be invoked at `https://<project-ref>.supabase.co/functions/v1/<function-name>`.

### 1.1 `trip-engine`

- **Purpose**: Handles trip state machine updates and triggers push notifications to students.
- **Security**: Requires a valid user JWT (`Authorization: Bearer <token>`). Rate limited to 30 requests/60s.
- **Headers**:
  - `Authorization`: Bearer `<JWT>` (Required)
  - `idempotency-key`: `<UUID>` (Optional, to prevent double processing)
- **Payload**:
  ```json
  {
    "trip_id": "UUID",
    "new_status": "driver_waiting | in_transit | completed | absent | cancelled",
    "lat": 33.3128, // Optional
    "lng": 44.3615 // Optional
  }
  ```
- **Response (200 OK)**:
  ```json
  { "success": true }
  ```

### 1.2 `send-notification`

- **Purpose**: Dispatches broadcast or targeted push notifications via Expo.
- **Security**: Requires admin or driver role. Rate limited to 10 requests/60s.
- **Payload**:
  ```json
  {
    "target_user_id": "UUID", // Optional (Provide either target_user_id or target_role)
    "target_role": "all | student | driver", // Optional
    "title": "Notification Title",
    "body": "Notification Body",
    "data": {} // Optional JSON payload
  }
  ```
- **Response (200 OK)**:
  ```json
  { "success": true }
  ```

### 1.3 `log-error`

- **Purpose**: Captures and prints client-side errors for logging.
- **Security**: Public endpoint (`verify_jwt = false`) to allow error reporting even during authentication failures.
- **Payload**:
  ```json
  {
    "message": "Error message",
    "stack": "Stack trace...", // Optional
    "client": "mobile | admin"
  }
  ```

---

## 2. Database Stored Procedures (RPCs)

These functions are executed inside PostgreSQL. They are accessed via the Supabase client using `.rpc('function_name', { params })`.

### 2.1 `activate_license(p_code TEXT)`

- **Description**: Atomic redemption of an 8-character license. Locks the license, checks seats, decrements them, creates the subscription, and logs the audit event.
- **Permissions**: Accessible only by `authenticated` users with the `student` role. Rate limited.
- **Returns**: `UUID` (Created subscription ID).

### 2.2 `cancel_subscription(p_subscription_id UUID)`

- **Description**: Revokes a student's active subscription and returns the route seat.
- **Permissions**: Student (own subscription only) or Admin (any subscription).
- **Returns**: `void`.

### 2.3 `create_trip(p_route_id UUID, p_scheduled_at TIMESTAMPTZ)`

- **Description**: Driver-facing procedure to schedule a new trip. Checks that the driver is verified and assigned to the route.
- **Permissions**: Assigned driver only.
- **Returns**: `UUID` (Created trip ID).

### 2.4 `update_trip_status(p_trip_id UUID, p_new_status TEXT, p_lat NUMERIC, p_lng NUMERIC, p_driver_id UUID)`

- **Description**: Updates the trip state after running state machine validations. Updates GPS coordinates and timestamps.
- **Permissions**: Internal use only. Public execution is revoked.
- **Returns**: `void`.

### 2.5 `update_trip_location(p_trip_id UUID, p_lat NUMERIC, p_lng NUMERIC)`

- **Description**: Updates the driver's current coordinates during an active trip (`driver_waiting` or `in_transit`). Enforces coordinate validation.
- **Permissions**: Assigned driver only.
- **Returns**: `BOOLEAN`.

### 2.6 `bulk_update_trip_locations(p_locations JSONB)`

- **Description**: Minimizes network usage by batch-updating multiple trip coordinates. Rate limited to 100 requests/60s.
- **Permissions**: Authenticated drivers.
- **Returns**: `JSONB` showing `success_count` and `failed` logs array:
  ```json
  {
    "success_count": 5,
    "failed": []
  }
  ```

### 2.7 `request_payout(p_amount NUMERIC)`

- **Description**: Submits a payout request. Locks tables to calculate the exact available balance (`earned` minus `completed/pending payouts`).
- **Permissions**: Drivers only.
- **Returns**: `void`.

### 2.8 `update_payout_status(p_payout_id UUID, p_new_status TEXT)`

- **Description**: Admin command to set payout status to `completed` or `rejected`.
- **Permissions**: Admin only.
- **Returns**: `JSON` representation of the updated payout.

### 2.9 `get_unread_count()`

- **Description**: Computes the number of unread messages in conversations participating the current user.
- **Permissions**: Authenticated users.
- **Returns**: `INTEGER`.

### 2.10 `mark_messages_read(p_conversation_id UUID)`

- **Description**: Marks all incoming messages in a conversation as read. Verifies the user is a participant.
- **Permissions**: Authenticated conversation participants.
- **Returns**: `void`.

### 2.11 `register_push_token(p_token TEXT)`

- **Description**: Registers or updates the Expo push notification token for the user.
- **Permissions**: Authenticated users.
- **Returns**: `void`.

### 2.12 `get_app_config()`

- **Description**: Retrieves the minimum supported app version.
- **Permissions**: Public (`anon` / `authenticated`).
- **Returns**: `JSONB` containing `min_version` and `latest_version`.

### 2.13 `get_dashboard_stats()`

- **Description**: Gathers system metrics (total users, active subscriptions, revenue in IQD) for the admin dashboard.
- **Permissions**: Admin only.
- **Returns**: `JSON`.

### 2.14 `ping()`

- **Description**: Direct query to check database connectivity.
- **Permissions**: Authenticated users.
- **Returns**: `BOOLEAN` (Always `true`).
