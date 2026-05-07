import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2847] to-[#1a3a6b] p-4"
      dir="rtl"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-8">
          <ShieldAlert className="text-red-400" size={48} />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">غير مصرّح بالدخول</h1>
        <p className="text-blue-200 text-lg mb-2">
          عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة.
        </p>
        <p className="text-blue-300/70 mb-10">يجب أن تكون مديراً للنظام للوصول إلى لوحة التحكم.</p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
        >
          العودة لتسجيل الدخول
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
