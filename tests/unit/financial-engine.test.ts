import { describe, it, expect } from 'vitest';
import {
  createMoney,
  calculateCommission,
  calculateDriverPayout,
  calculatePerTripCost,
  calculateReferralDiscount,
  calculateSavings,
  toNumberValue,
  formatMoney,
} from '../../artifacts/mobile/lib/money';

describe('Financial Engine — Real Money Module Tests', () => {
  describe('calculatePerTripCost', () => {
    it('should correctly divide monthly fee by total trips (22 days × 2 trips)', () => {
      const monthlyFee = createMoney(90000);
      const perTrip = calculatePerTripCost(monthlyFee, 22, 2);
      expect(toNumberValue(perTrip)).toBe(2045);
    });

    it('should use floor division to avoid floating-point errors', () => {
      const monthlyFee = createMoney(90000);
      const perTrip = calculatePerTripCost(monthlyFee, 22, 2);
      const totalTrips = 22 * 2;
      const expected = Math.floor(90000 / totalTrips);
      expect(toNumberValue(perTrip)).toBe(expected);
    });

    it('should handle default tripsPerDay=2', () => {
      const monthlyFee = createMoney(90000);
      const perTrip = calculatePerTripCost(monthlyFee, 22);
      expect(toNumberValue(perTrip)).toBe(2045);
    });

    it('should handle single trip per day', () => {
      const monthlyFee = createMoney(90000);
      const perTrip = calculatePerTripCost(monthlyFee, 22, 1);
      expect(toNumberValue(perTrip)).toBe(Math.floor(90000 / 22));
    });

    it('should produce integer results (no fractional IQD)', () => {
      const monthlyFee = createMoney(90000);
      const perTrip = calculatePerTripCost(monthlyFee, 22, 2);
      expect(Number.isInteger(toNumberValue(perTrip))).toBe(true);
    });
  });

  describe('calculateCommission', () => {
    it('should calculate 15% commission on 90,000 IQD', () => {
      const monthlyFee = createMoney(90000);
      const commission = calculateCommission(monthlyFee, 15);
      expect(toNumberValue(commission)).toBe(13500);
    });

    it('should calculate 20% commission on 80,000 IQD', () => {
      const monthlyFee = createMoney(80000);
      const commission = calculateCommission(monthlyFee, 20);
      expect(toNumberValue(commission)).toBe(16000);
    });

    it('should produce integer commission values', () => {
      const monthlyFee = createMoney(99001);
      const commission = calculateCommission(monthlyFee, 15);
      expect(Number.isInteger(toNumberValue(commission))).toBe(true);
    });

    it('should handle 0% commission', () => {
      const monthlyFee = createMoney(90000);
      const commission = calculateCommission(monthlyFee, 0);
      expect(toNumberValue(commission)).toBe(0);
    });
  });

  describe('calculateDriverPayout', () => {
    it('should subtract commission from monthly fee', () => {
      const monthlyFee = createMoney(90000);
      const commission = createMoney(13500);
      const payout = calculateDriverPayout(monthlyFee, commission);
      expect(toNumberValue(payout)).toBe(76500);
    });

    it('should equal monthly fee when commission is 0', () => {
      const monthlyFee = createMoney(90000);
      const commission = createMoney(0);
      const payout = calculateDriverPayout(monthlyFee, commission);
      expect(toNumberValue(payout)).toBe(90000);
    });

    it('should equal 0 when commission equals monthly fee', () => {
      const monthlyFee = createMoney(90000);
      const commission = createMoney(90000);
      const payout = calculateDriverPayout(monthlyFee, commission);
      expect(toNumberValue(payout)).toBe(0);
    });
  });

  describe('calculateReferralDiscount', () => {
    it('should subtract flat discount from amount', () => {
      const amount = createMoney(90000);
      const discounted = calculateReferralDiscount(amount, 5000);
      expect(toNumberValue(discounted)).toBe(85000);
    });

    it('should handle 0 discount', () => {
      const amount = createMoney(90000);
      const discounted = calculateReferralDiscount(amount, 0);
      expect(toNumberValue(discounted)).toBe(90000);
    });
  });

  describe('calculateSavings', () => {
    it('should calculate difference between original and discounted', () => {
      const original = createMoney(90000);
      const discounted = createMoney(85000);
      const savings = calculateSavings(original, discounted);
      expect(toNumberValue(savings)).toBe(5000);
    });
  });

  describe('Financial Consistency Invariants', () => {
    it('commission + driver payout = monthly fee (no money lost)', () => {
      const monthlyFee = createMoney(90000);
      const commission = calculateCommission(monthlyFee, 15);
      const payout = calculateDriverPayout(monthlyFee, commission);
      expect(toNumberValue(commission) + toNumberValue(payout)).toBe(90000);
    });

    it('per-trip cost × total trips ≤ monthly fee (never over-pays)', () => {
      const monthlyFee = createMoney(90000);
      const perTrip = calculatePerTripCost(monthlyFee, 22, 2);
      const totalTrips = 22 * 2;
      expect(toNumberValue(perTrip) * totalTrips).toBeLessThanOrEqual(90000);
    });

    it('referral discount never makes fee negative', () => {
      const amount = createMoney(5000);
      const discounted = calculateReferralDiscount(amount, 5000);
      expect(toNumberValue(discounted)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('formatMoney', () => {
    it('should format money with IQD suffix', () => {
      const money = createMoney(90000);
      expect(formatMoney(money)).toContain('90000');
      expect(formatMoney(money)).toContain('IQD');
    });
  });
});
