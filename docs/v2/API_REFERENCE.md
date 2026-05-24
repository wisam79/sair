# Sair v2 - API & Functions Reference 📡

## Edge Functions

### 1. `atomic-booking`

- **Purpose**: Atomic seat reservation.
- **Endpoint**: `POST /functions/v1/atomic-booking`
- **Payload**:
  ```json
  {
    "routeId": "UUID",
    "studentId": "UUID"
  }
  ```
- **Security**: Requires Service Role Key or valid User JWT.

### 2. `trip-engine`

- **Purpose**: Trip state management with GPS verification.
- **Endpoint**: `POST /functions/v1/trip-engine`
- **Payload**:
  ```json
  {
    "tripId": "UUID",
    "newStatus": "TripStatus",
    "lat": 33.3,
    "lng": 44.4
  }
  ```

## Database RPCs

### `reserve_seat(p_route_id, p_student_id)`

- **Type**: PL/pgSQL Function.
- **Logic**: Pessimistic Locking (`FOR UPDATE`).
- **Returns**: `void` or `RAISE EXCEPTION`.
