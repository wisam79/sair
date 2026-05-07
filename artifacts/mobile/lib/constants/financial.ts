import { createMoney, type Money } from '@/lib/money';

export const DEFAULT_APP_SETTINGS = {
  monthly_fee: 90000,
  commission_amount_iqd: 20000,
  referral_discount: 5000,
  cancellation_fee: 0,
  absence_deduction_rate: 0,
  target_work_days: 22,
  monthly_period_days: 30,
} as const;

export type AppSettings = typeof DEFAULT_APP_SETTINGS;

export const DEFAULT_MONEY = {
  monthlyFee: createMoney(DEFAULT_APP_SETTINGS.monthly_fee),
  commission: createMoney(DEFAULT_APP_SETTINGS.commission_amount_iqd),
  referralDiscount: createMoney(DEFAULT_APP_SETTINGS.referral_discount),
};

export function getMoneyFromSettings(settings: AppSettings) {
  return {
    monthlyFee: createMoney(settings.monthly_fee),
    commission: createMoney(settings.commission_amount_iqd),
    referralDiscount: createMoney(settings.referral_discount),
  };
}
