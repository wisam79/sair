'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import { Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const initialState = { error: '' };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2847] to-[#1a3a6b] p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="bg-[#FF6B35] text-white px-3 py-1.5 rounded-lg text-sm font-bold">
              مدير
            </span>
            <h1 className="text-4xl font-bold text-white">UniRide</h1>
          </div>
          <p className="text-blue-200 text-lg">لوحة تحكم إدارة النقل الجامعي</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">تسجيل الدخول</h2>
          <p className="text-gray-500 text-center mb-8">أدخل بياناتك للمتابعة</p>

          <form action={formAction} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="البريد الإلكتروني"
              required
              autoComplete="email"
              dir="ltr"
              placeholder="example@uniride.com"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="كلمة المرور"
              required
              autoComplete="current-password"
              dir="ltr"
              placeholder="••••••••"
            />

            {state?.error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                role="alert"
              >
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-3.5 text-lg flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>
        </div>

        <p className="text-blue-300/60 text-center text-sm mt-8">
          © 2026 UniRide. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
