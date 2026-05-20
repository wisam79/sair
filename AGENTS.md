# UniRide v2 — Agent Instructions

> هذا الملف يُوجّه أي AI agent يعمل على المشروع. اقرأه قبل أي تعديل.

---

## 1. نظرة سريعة على المشروع

UniRide هو منصة نقل ذكي للجامعة (العراق). Monorepo بـ pnpm:

```
apps/admin     → Next.js 16 + App Router + Refine + MUI (لوحة تحكم)
apps/mobile    → Expo 54 + React Native (تطبيق الطلاب/السائقين)
packages/core  → Zod schemas, i18n, state machine
supabase/      → Edge Functions (Deno) + SQL Migrations (production truth)
```

> ⚠️ `packages/db` (Drizzle) **محذوف تماماً** — لا تُضِف أي كود يعتمد عليه. استخدم Supabase RPCs فقط.

**لا تبني واجهات UI جديدة** — افترض الواجهة مكتملة ما لم يُطلب منك غير ذلك. ركّز على المنطق الخلفي، الحالة، والأداء.

---

## 2. ⚠️ قواعد أمان حرجة — لا تنتهكها

### 2.1 `app_metadata` وليس `user_metadata`

```typescript
// ❌ خطأ فادح — user_metadata يمكن للعميل تعديله (privilege escalation)
const role = user.user_metadata?.role;

// ✅ صحيح — app_metadata يكتبها admin فقط (خادم)
const role = user.app_metadata?.role;
```

### 2.2 `get_my_role()` بدون fallback

```sql
-- ✅ صحيح — app_metadata فقط
CREATE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql;
```

---

## 3. 🔴 مصدر الحقيقة لقاعدة البيانات

### 3.1 Supabase Migrations فقط (لا Drizzle)

**مهم جداً:**

- اكتب Migration جديد في `supabase/migrations/` → ثم ارفعه للإنتاج
- `supabase db push` تقرأ من `supabase/migrations/`

### 3.2 تسمية Migrations

```
Pattern: YYYYMMDDNN_description.sql
```

### 3.3 لا تحمّل كل البيانات بـ `pageSize: 0`

استخدم الـ RPCs المخصصة (مثل `get_dashboard_stats()`) بدلاً من جلب كل البيانات وتحميل الذاكرة.

---

## 4. 🔠 Types & Validation (`@uniride/core`)

- **Strict snake_case:** يمنع منعاً باتاً استخدام `camelCase` في `@uniride/core` (مثل `BookingRequest` أو `TripUpdateRequest`). قواعد البيانات والـ API تعتمد `snake_case` حصراً.
- **Zod schemas هي مصدر الحقيقة الوحيد:** Edge Functions **يجب** أن تستخدم `@uniride/core` للتحقق من صحة الطلبات (لا تكتب validation مزدوج).
- **License Codes:** طول أكواد الترخيص هو 8 أحرف بالظبط (لا 12). يجب تحديث النصوص والـ Schemas لتعكس ذلك.
- **لا تستخدم `any` أبداً:** يمنع استخدام `eslint-disable` لتمرير الـ `any` (مثال: `dataProvider.ts` في Admin). استخدم Zod Types.

---

## 5. 🧵 التزامنية (Concurrency) — Race Conditions

- العمليات الحساسة (مثل التراخيص أو المقاعد) تستخدم `FOR UPDATE NOWAIT` أو آليات Pessimistic Locking المشابهة داخل RPCs.
- جميع الدوال الحساسة مالياً يجب أن تتعامل بحذر لتجنب Race Conditions.
- Idempotency ضروري في Edge Functions لتفادي تكرار العمليات.

---

## 6. 🐢 Rate Limiting — DB-backed فقط

لا تستخدم `Map()` في الذاكرة. استخدم جدول للـ `rate_limits` في قواعد البيانات. Edge functions (مثل `trip-engine` و `send-notification`) يجب أن تطبق Rate Limiting قبل إرسال الرسائل أو تحديث الحالة.

---

## 7. 📱 Offline-First (Mobile)

GPS Queue مدعوم بـ AsyncStorage، واستخدم `ping()` لفحص الشبكة. تأكد من أن الـ Zustand stores يتم لها Hydration قبل التوجيه في `_layout.tsx`.

---

## 8. 🔄 State Machine — انتقالات الرحلة

```
scheduled ──► driver_waiting ──► in_transit ──► completed
    │                │                 │
    ▼                ▼                 ▼
  absent          cancelled         cancelled
    │                │
    ▼                ▼
cancelled
```

> **ملاحظة هامة**: يجب أن يُسمح للسائق بـإلغاء الرحلة حتى وهي `in_transit` (حالات الطوارئ). يمنع الانتقال من `in_transit` إلى `absent`.

---

## 9. 📱 نظام التراخيص (M3)

لا نستخدم الحجز المباشر بل نستخدم **أكواد ترخيص** مدفوعة.
Admin → `create_license_batch()` → يولّد أكواد بطول 8 Characters.
Student → `activate_license(code)` → يُنشئ subscription للخط المحدد.

> المقاعد تكون تابعة للـ Subscription (الاشتراك) وليس للـ Trip الفردية.

---

## 10. 🖥️ Frontend Architecture (Admin & Mobile)

- **Admin App (Next.js):** استخدم React Server Components (RSC) لـ data fetching عند الإمكان. لا تضع `use client` على كل التطبيق بلا حاجة. تعامل بشكل صحيح مع Loading و Error states لتجنب تعليق الشاشة (Deadlocks).
- **Mobile App (Expo):** تجنب تماماً استخدام inline functions داخل `renderItem` و `ListEmptyComponent` في `FlatList` لتفادي هبوط الأداء (استخدم `useCallback` و `React.memo`).
- **Zustand Hydration:** في Mobile (داخل `_layout.tsx`)، تأكد أن حالة الـ Zustand مكتملة التحميل (Hydrated) من `AsyncStorage` قبل عمل Redirects للمستخدم لتجنب Race Conditions في شاشة الـ Login.
- **i18n & RTL:** لا تضع نصوص (Strings) صلبة أبداً في الكود. استخدم مفاتيح الترجمة من `@uniride/core` وتأكد من دعم RTL عبر الخصائص المنطقية (Logical Properties).

---

## 11. 📡 Realtime — أنماط صحيحة

ادعم الـ auto-reconnect وتجنب عمل re-fetch لجميع الصفحات من الصفر عند كل تحديث. حدث البيانات بشكل موضعي أو أعد جلب الصفحة الحالية فقط.

---

## 12. 🧪 Testing & CI/CD Security

- **أمن CI/CD:** مسارات Auto-merge و Auto-PR تشكل خطراً أمنياً وتمسح فوراً لتفادي دمج كود خبيث في `main` بدون مراجعة.
- **E2E Testing:** الـ `playwright.config.ts` يجب أن تشغل **جميع** مسارات الاختبار (Payments, Licenses, Trips). لا تقم بقمع الاختبارات الفاشلة.
- **Integration Tests:** الاختبارات يجب أن تُجري Queries حقيقية على قاعدة البيانات المحلية لـ Supabase للتحقق من RPCs والـ locks الفعلية. الموك (In-Memory Mocks) غير مقبولة هنا.

---

## 13. 🔑 Supabase Projects

| البيئة     | ref                    | الملف                  |
| ---------- | ---------------------- | ---------------------- |
| Production | `zpcvvyxtmxzplmojobbv` | `.temp/linked-project` |
| Local dev  | `pfjsqgqrxnrlrfnchnqf` | `.env`                 |
