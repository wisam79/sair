import { dinero, toDecimal, add, subtract, multiply, toUnits, type Dinero } from 'dinero.js';

// IQD currency definition (Iraqi Dinar - no decimal places for whole amounts)
const IQD = {
  code: 'IQD',
  base: 10,
  exponent: 0,
};

export type Money = Dinero<number>;

export const createMoney = (amount: number): Money => dinero({ amount, currency: IQD });

export const formatMoney = (money: Money): string => {
  const value = toDecimal(money);
  return `${value} IQD`;
};

export const formatMoneyShort = (money: Money): string => {
  return toDecimal(money);
};

export const toNumberValue = (money: Money): number => {
  return toUnits(money)[0];
};

export const calculateCommission = (monthlyFee: Money, commissionRate: number): Money => {
  // commissionRate is a percentage (e.g., 15 for 15%)
  return multiply(monthlyFee, { amount: commissionRate, scale: 2 });
};

export const calculateDriverPayout = (monthlyFee: Money, commission: Money): Money => {
  return subtract(monthlyFee, commission);
};

export const calculatePerTripCost = (monthlyFee: Money, workDays: number, tripsPerDay: number = 2): Money => {
  const totalTrips = workDays * tripsPerDay;
  const totalCents = toUnits(monthlyFee)[0];
  const perTrip = Math.floor(totalCents / totalTrips);
  return createMoney(perTrip);
};

export const calculateReferralDiscount = (amount: Money, discount: number): Money => {
  return subtract(amount, createMoney(discount));
};

export const calculateSavings = (original: Money, discounted: Money): Money => {
  return subtract(original, discounted);
};

export const calculatePercentage = (amount: Money, percentage: number): Money => {
  return multiply(amount, { amount: percentage, scale: 2 });
};
