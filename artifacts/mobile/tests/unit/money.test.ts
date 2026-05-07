import { describe, it, expect } from 'vitest';
import { createMoney, calculateCommission, calculateDriverPayout, formatMoney, toNumberValue } from '../../lib/money';
import { dinero, toDecimal } from 'dinero.js';

describe('Dinero.js Financial Engine', () => {
  it('creates money with IQD currency', () => {
    const money = createMoney(90000);
    expect(formatMoney(money)).toBe('90000 IQD');
  });

  it('calculates 15% commission correctly', () => {
    const fee = createMoney(90000);
    const commission = calculateCommission(fee, 15);
    expect(toNumberValue(commission)).toBe(13500);
  });

  it('calculates driver payout correctly', () => {
    const fee = createMoney(90000);
    const commission = calculateCommission(fee, 15);
    const payout = calculateDriverPayout(fee, commission);
    expect(toNumberValue(payout)).toBe(76500);
  });

  it('formats money correctly with IQD', () => {
    const money = createMoney(70000);
    const formatted = formatMoney(money);
    expect(formatted).toContain('IQD');
    expect(formatted).toContain('70000');
  });

  it('handles zero amounts', () => {
    const money = createMoney(0);
    expect(toNumberValue(money)).toBe(0);
  });

  it('calculates commission at different rates', () => {
    const fee = createMoney(100000);
    const commission = calculateCommission(fee, 20);
    expect(toNumberValue(commission)).toBe(20000);
  });
});
