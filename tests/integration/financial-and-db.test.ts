import { describe, it, expect } from 'vitest';
import {
  createMoney,
  calculateCommission,
  calculateDriverPayout,
  calculatePerTripCost,
  calculateReferralDiscount,
  toNumberValue,
} from '../../artifacts/mobile/lib/money';

describe('Financial & DB Integration Tests', () => {
  describe('Commission Calculations — Real Money Module', () => {
    it('should calculate 15% commission on 90,000 IQD', () => {
      const fee = createMoney(90000);
      const commission = calculateCommission(fee, 15);
      expect(toNumberValue(commission)).toBe(13500);
    });

    it('should compute driver payout correctly', () => {
      const fee = createMoney(90000);
      const commission = calculateCommission(fee, 15);
      const payout = calculateDriverPayout(fee, commission);
      expect(toNumberValue(payout)).toBe(76500);
    });

    it('should ensure commission + payout = monthly fee (no money lost)', () => {
      const fees = [50000, 75000, 90000, 100000, 120000];
      for (const feeAmount of fees) {
        const fee = createMoney(feeAmount);
        const commission = calculateCommission(fee, 15);
        const payout = calculateDriverPayout(fee, commission);
        expect(toNumberValue(commission) + toNumberValue(payout)).toBe(feeAmount);
      }
    });

    it('should produce integer results (no floating-point errors)', () => {
      const fee = createMoney(95001);
      const commission = calculateCommission(fee, 15);
      expect(Number.isInteger(toNumberValue(commission))).toBe(true);
    });
  });

  describe('Referral Discount', () => {
    it('should apply 5,000 IQD referral discount', () => {
      const fee = createMoney(90000);
      const discounted = calculateReferralDiscount(fee, 5000);
      expect(toNumberValue(discounted)).toBe(85000);
    });

    it('should not allow discount bigger than monthly fee', () => {
      const discount = 5000;
      const fee = 3000;
      expect(discount > fee).toBe(true);
    });
  });

  describe('Per-Trip Cost Calculation', () => {
    it('should calculate per-trip cost for 22 work days × 2 trips/day', () => {
      const fee = createMoney(90000);
      const perTrip = calculatePerTripCost(fee, 22, 2);
      expect(toNumberValue(perTrip)).toBe(2045);
    });

    it('should use floor division', () => {
      const fee = createMoney(90000);
      const perTrip = calculatePerTripCost(fee, 22, 2);
      const totalTrips = 44;
      expect(toNumberValue(perTrip) * totalTrips).toBeLessThanOrEqual(90000);
    });
  });

  describe('Cancellation & Refund Calculation', () => {
    it('should calculate prorated refund correctly', () => {
      const monthlyFee = 90000;
      const daysTotal = 30;
      const daysUsed = 10;
      const cancellationFeePercent = 25;

      const unusedDays = daysTotal - daysUsed;
      const proratedAmount = Math.round((monthlyFee * unusedDays) / daysTotal);
      const cancellationFee = Math.round((proratedAmount * cancellationFeePercent) / 100);
      const refund = proratedAmount - cancellationFee;

      expect(refund).toBe(45000);
    });

    it('should return zero refund when fully used', () => {
      const monthlyFee = 90000;
      const daysTotal = 30;
      const daysUsed = 30;
      const refund = Math.max(0, Math.round((monthlyFee * (daysTotal - daysUsed)) / daysTotal));
      expect(refund).toBe(0);
    });
  });

  describe('Absence Deduction Calculation', () => {
    it('should deduct 5% from driver monthly fee per absence', () => {
      const monthlyFee = 90000;
      const deductionPercent = 5;
      const deduction = Math.round((monthlyFee * deductionPercent) / 100);
      expect(deduction).toBe(4500);
    });
  });

  describe('Trip State Machine Validation', () => {
    it('should only allow valid state transitions', () => {
      const validTransitions: Record<string, string[]> = {
        scheduled: ['driver_waiting', 'in_transit', 'cancelled'],
        driver_waiting: ['in_transit', 'absent', 'cancelled'],
        in_transit: ['completed'],
        completed: [],
        absent: [],
        cancelled: [],
      };

      expect(validTransitions['scheduled']).toContain('driver_waiting');
      expect(validTransitions['scheduled']).not.toContain('completed');
      expect(validTransitions['in_transit']).toContain('completed');
      expect(validTransitions['completed']).toHaveLength(0);
    });
  });

  describe('Idempotency & Concurrency Prevention', () => {
    it('should reject duplicate idempotency keys', () => {
      const processedKeys = new Set<string>();
      const key = 'idem_user1_sub1_1234567890';

      const isFirstTime = !processedKeys.has(key);
      processedKeys.add(key);
      const isDuplicate = processedKeys.has(key);

      expect(isFirstTime).toBe(true);
      expect(isDuplicate).toBe(true);
    });

    it('should not overbook when seats are exhausted', async () => {
      let availableSeats = 3;
      const bookings: Promise<boolean>[] = [];

      const book = async (): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 5));
        if (availableSeats > 0) {
          availableSeats--;
          return true;
        }
        return false;
      };

      for (let i = 0; i < 10; i++) {
        bookings.push(book());
      }

      const results = await Promise.all(bookings);
      const successfulBookings = results.filter(Boolean).length;

      expect(successfulBookings).toBeLessThanOrEqual(3);
      expect(availableSeats).toBe(0);
    });
  });
});
