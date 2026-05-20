# 📝 Changelog — UniRide Mobile

> سجل تغييرات مفصّل. يُحدّث مع كل مهمة مكتملة.

## التنسيق

```
## [التاريخ] — Phase X: [العنوان]

### 🔴 Critical / 🟠 Fix / 🟢 Feature / 🎨 UI / ⚡ Performance

- **[ID]** وصف التغيير
  - الملفات: `path/to/file.tsx`
  - الأسباب: لماذا تم التغيير
  - التأثير: ما الذي تغيّر للمستخدم
```

---

## Unreleased

> المهام المكتملة التي لم تُنشر بعد في إصدار.

### 🔴 Critical

- **[Task 1.1]** إزالة اختيار الدور أثناء التسجيل
  - الملفات: `apps/mobile/app/login.tsx`, `packages/core/index.ts`
  - الأسباب: منع Privilege Escalation وتجنب إرسال الدور من العميل
  - التأثير: المستخدم لا يرى خيار اختيار الدور (student/driver) بل يرى رسالة توضيحية.

- **[Task 1.2]** استبدال الإلغاء المباشر للاشتراك بـ RPC
  - الملفات: `apps/mobile/app/subscriptions.tsx`, `supabase/migrations/2026051907_cancel_subscription_rpc.sql`
  - الأسباب: تأمين عملية الإلغاء (RLS) واسترجاع المقعد للخط (`available_seats`) باستخدام قفل لمنع مشاكل التزامن.
  - التأثير: استقرار في أعداد المقاعد المتاحة وعدم القدرة على تجاوز القواعد عبر التطبيق.

- **[Task 1.3]** إضافة `expo-secure-store`
  - الملفات: `apps/mobile/package.json`
  - الأسباب: التبعية كانت مفقودة رغم استخدامها في التخزين المؤقت.
  - التأثير: استقرار التطبيق.

- **[Task 1.4-1.6]** إزالة الـ `any` و `as unknown as`
  - الملفات: `apps/mobile/app/index.tsx`, `apps/mobile/app/onboarding.tsx`, `apps/mobile/app/driver.tsx`, `apps/mobile/src/hooks/useTrips.ts`
  - الأسباب: تأمين أنواع TypeScript والتأكد من تطابق البيانات مع واجهة المستخدم.
  - التأثير: أخطاء أقل وموثوقية أعلى للبيانات.

- **[Task 1.7]** مسح الـ Offline Cache عند الـ Logout
  - الملفات: `apps/mobile/src/hooks/useStore.ts`
  - الأسباب: منع تسريب البيانات الشخصية للمستخدم التالي بعد تسجيل الخروج.
  - التأثير: أمان أكثر عند التبديل بين الحسابات.

- **[Task 1.8]** تسجيل شاشات المحادثة
  - الملفات: `apps/mobile/app/_layout.tsx`
  - الأسباب: تفعيل إمكانية التنقل لشاشات الرسائل بدون أخطاء مفقودة.
  - التأثير: وصول سليم لواجهات المحادثة.

---

## [2026-05-18] — Phase 0: Audit & Planning

### 📋 Planning

- **AUDIT-001** إنشاء نظام التوثيق والتقدم
  - الملفات: `docs/mobile-roadmap/**`
  - الأسباب: لا يوجد نظام توثيق أو تتبع تقدم للتطبيق
  - التأثير: نظام صارم لتتبع كل تعديل
