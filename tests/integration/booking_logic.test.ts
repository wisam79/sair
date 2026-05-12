import { describe, it, expect, beforeEach } from 'vitest';
import { canTransition, TripStatus } from '../../packages/core/index';

type RouteState = {
  id: string;
  available_seats: number;
  subscriptions: Set<string>;
};

class MockBookingStore {
  private routes: Map<string, RouteState> = new Map();

  constructor() {
    this.routes.set('route-1', {
      id: 'route-1',
      available_seats: 5,
      subscriptions: new Set(),
    });
    this.routes.set('route-2', {
      id: 'route-2',
      available_seats: 1,
      subscriptions: new Set(),
    });
    this.routes.set('route-3', {
      id: 'route-3',
      available_seats: 0,
      subscriptions: new Set(),
    });
  }

  reserveSeat(routeId: string, studentId: string): { success: boolean; error?: string } {
    const route = this.routes.get(routeId);
    if (!route) {
      return { success: false, error: 'Route not found' };
    }

    if (route.available_seats <= 0) {
      return { success: false, error: 'No seats available' };
    }

    if (route.subscriptions.has(studentId)) {
      return { success: false, error: 'Already subscribed to this route' };
    }

    route.available_seats--;
    route.subscriptions.add(studentId);
    return { success: true };
  }

  getSeats(routeId: string): number {
    return this.routes.get(routeId)?.available_seats ?? 0;
  }
}

class MockTripStateMachine {
  private trips: Map<string, TripStatus> = new Map();

  constructor() {
    this.trips.set('trip-1', 'scheduled' as TripStatus);
    this.trips.set('trip-2', 'driver_waiting' as TripStatus);
    this.trips.set('trip-3', 'in_transit' as TripStatus);
    this.trips.set('trip-4', 'completed' as TripStatus);
  }

  transition(tripId: string, newStatus: TripStatus): { success: boolean; error?: string } {
    const currentStatus = this.trips.get(tripId);
    if (!currentStatus) {
      return { success: false, error: 'Trip not found' };
    }

    if (!canTransition(currentStatus, newStatus)) {
      return { success: false, error: `Invalid transition: ${currentStatus} -> ${newStatus}` };
    }

    this.trips.set(tripId, newStatus);
    return { success: true };
  }

  getStatus(tripId: string): TripStatus | undefined {
    return this.trips.get(tripId);
  }
}

describe('Booking System Integration', () => {
  let bookingStore: MockBookingStore;

  beforeEach(() => {
    bookingStore = new MockBookingStore();
  });

  describe('Seat Reservation', () => {
    it('should reserve a seat when available', () => {
      const result = bookingStore.reserveSeat('route-1', 'student-1');
      expect(result.success).toBe(true);
      expect(bookingStore.getSeats('route-1')).toBe(4);
    });

    it('should prevent booking when seats are zero', () => {
      const result = bookingStore.reserveSeat('route-3', 'student-1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No seats available');
    });

    it('should prevent double booking by the same student', () => {
      bookingStore.reserveSeat('route-1', 'student-1');
      const result = bookingStore.reserveSeat('route-1', 'student-1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Already subscribed to this route');
    });

    it('should handle multiple students booking the same route', () => {
      bookingStore.reserveSeat('route-1', 'student-1');
      bookingStore.reserveSeat('route-1', 'student-2');
      bookingStore.reserveSeat('route-1', 'student-3');
      expect(bookingStore.getSeats('route-1')).toBe(2);
    });

    it('should handle booking the last seat', () => {
      bookingStore.reserveSeat('route-2', 'student-1');
      expect(bookingStore.getSeats('route-2')).toBe(0);
      const result = bookingStore.reserveSeat('route-2', 'student-2');
      expect(result.success).toBe(false);
    });

    it('should reject non-existent routes', () => {
      const result = bookingStore.reserveSeat('route-nonexistent', 'student-1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Route not found');
    });
  });

  describe('Concurrent Booking Simulation', () => {
    it('should handle sequential bookings correctly (simulated concurrency)', () => {
      let seats = 5;
      for (let i = 0; i < 5; i++) {
        const result = bookingStore.reserveSeat('route-1', `student-${i}`);
        expect(result.success).toBe(true);
        seats--;
        expect(bookingStore.getSeats('route-1')).toBe(seats);
      }

      expect(bookingStore.getSeats('route-1')).toBe(0);
      const result = bookingStore.reserveSeat('route-1', 'student-6');
      expect(result.success).toBe(false);
    });
  });
});

describe('Trip State Machine Integration', () => {
  let sm: MockTripStateMachine;

  beforeEach(() => {
    sm = new MockTripStateMachine();
  });

  describe('Valid Transitions', () => {
    it('should transition from scheduled to driver_waiting', () => {
      const result = sm.transition('trip-1', 'driver_waiting');
      expect(result.success).toBe(true);
      expect(sm.getStatus('trip-1')).toBe('driver_waiting');
    });

    it('should transition from scheduled to cancelled', () => {
      const result = sm.transition('trip-1', 'cancelled');
      expect(result.success).toBe(true);
      expect(sm.getStatus('trip-1')).toBe('cancelled');
    });

    it('should transition from driver_waiting to in_transit', () => {
      const result = sm.transition('trip-2', 'in_transit');
      expect(result.success).toBe(true);
      expect(sm.getStatus('trip-2')).toBe('in_transit');
    });

    it('should transition from in_transit to completed', () => {
      const result = sm.transition('trip-3', 'completed');
      expect(result.success).toBe(true);
      expect(sm.getStatus('trip-3')).toBe('completed');
    });

    it('should transition from in_transit to absent', () => {
      sm.transition('trip-2', 'in_transit');
      const result = sm.transition('trip-2', 'absent');
      expect(result.success).toBe(true);
      expect(sm.getStatus('trip-2')).toBe('absent');
    });
  });

  describe('Invalid Transitions', () => {
    it('should reject scheduled to in_transit (skip driver_waiting)', () => {
      const result = sm.transition('trip-1', 'in_transit');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid transition');
    });

    it('should reject scheduled to completed', () => {
      const result = sm.transition('trip-1', 'completed');
      expect(result.success).toBe(false);
    });

    it('should reject driver_waiting to scheduled (backwards)', () => {
      const result = sm.transition('trip-2', 'scheduled');
      expect(result.success).toBe(false);
    });

    it('should reject in_transit to scheduled', () => {
      const result = sm.transition('trip-3', 'scheduled');
      expect(result.success).toBe(false);
    });

    it('should reject any transition from completed', () => {
      expect(sm.transition('trip-4', 'scheduled').success).toBe(false);
      expect(sm.transition('trip-4', 'driver_waiting').success).toBe(false);
      expect(sm.transition('trip-4', 'in_transit').success).toBe(false);
      expect(sm.transition('trip-4', 'cancelled').success).toBe(false);
    });

    it('should reject transitions from cancelled (terminal state)', () => {
      sm.transition('trip-1', 'cancelled');
      expect(sm.transition('trip-1', 'scheduled').success).toBe(false);
      expect(sm.transition('trip-1', 'in_transit').success).toBe(false);
    });

    it('should reject non-existent trip', () => {
      const result = sm.transition('trip-nonexistent', 'scheduled');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Trip not found');
    });
  });

  describe('Full Trip Lifecycle', () => {
    it('should support a complete trip from scheduled to completed', () => {
      expect(sm.transition('trip-1', 'driver_waiting').success).toBe(true);
      expect(sm.getStatus('trip-1')).toBe('driver_waiting');

      expect(sm.transition('trip-1', 'in_transit').success).toBe(true);
      expect(sm.getStatus('trip-1')).toBe('in_transit');

      expect(sm.transition('trip-1', 'completed').success).toBe(true);
      expect(sm.getStatus('trip-1')).toBe('completed');
    });

    it('should support a cancelled trip from scheduled', () => {
      expect(sm.transition('trip-1', 'cancelled').success).toBe(true);
      expect(sm.getStatus('trip-1')).toBe('cancelled');
    });

    it('should support a cancelled trip from driver_waiting', () => {
      expect(sm.transition('trip-2', 'cancelled').success).toBe(true);
      expect(sm.getStatus('trip-2')).toBe('cancelled');
    });

    it('should support absent outcome from in_transit', () => {
      sm.transition('trip-2', 'in_transit');
      expect(sm.transition('trip-2', 'absent').success).toBe(true);
      expect(sm.getStatus('trip-2')).toBe('absent');
    });
  });
});
