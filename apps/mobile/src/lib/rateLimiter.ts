/**
 * Client-Side Rate Limiter
 * Prevents rapid repeated taps on sensitive actions (e.g. status updates, unsubscriptions)
 */

class RateLimiter {
  private timestamps = new Map<string, number>();

  /**
   * Checks if an action can proceed based on the cooldown period.
   * If it can proceed, it automatically records the current timestamp.
   *
   * @param action Identifier for the action (e.g., 'cancel_trip_${tripId}')
   * @param cooldownMs Minimum wait time in milliseconds (default: 2000)
   * @returns boolean True if action is allowed, False if rate limited
   */
  canProceed(action: string, cooldownMs: number = 2000): boolean {
    const now = Date.now();
    const last = this.timestamps.get(action) || 0;

    if (now - last < cooldownMs) {
      return false; // Cooldown active
    }

    this.timestamps.set(action, now);
    return true; // Action allowed
  }

  /**
   * Clears the cooldown for a specific action (e.g., if an error occurred and we want to allow immediate retry)
   */
  reset(action: string): void {
    this.timestamps.delete(action);
  }
}

export const ClientRateLimiter = new RateLimiter();
