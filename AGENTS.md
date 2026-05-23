# sair v2 — Agent Instructions

> هذا الملف يُوجّه أي AI agent يعمل على المشروع. **اقرأه قبل أي تعديل.**

---

## 1. نظرة عامة على المشروع

### 1.1 ما هو UniRide؟

UniRide هو **منصة نقل ذكي للجامعة** مبنية للعراق. تربط الطلاب بالسائقين عبر نظام اشتراكات مسبق بدل الحجز المباشر.

```
┌─────────────────────────────────────────────────────────────┐
│                      UniRide Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Student                          Driver                   │
│      │                               │                      │
│      ▼                               ▼                      │
│   [Mobile App]                  [Mobile App]                │
│   Expo + React Native           Expo + React Native          │
│      │                               │                      │
│      └───────────┬───────────────────┘                      │
│                  ▼                                          │
│           [Supabase Backend]                                │
│           Edge Functions + RPCs                             │
│                  │                                          │
│                  ▼                                          │
│          [PostgreSQL Database]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 هيكل المشروع (Monorepo)

```
sair/
├── apps/
│   ├── admin/          # Next.js 16 + App Router + Refine + MUI (لوحة تحكم)
│   └── mobile/          # Expo 54 + React Native (تطبيق الطلاب/السائقين)
├── packages/
│   └── core/           # Zod schemas, i18n, state machine (مصدرtruth للـ types)
├── supabase/
│   ├── migrations/     # SQL Migrations (مصدر truth لقاعدة البيانات)
│   └── functions/       # Edge Functions (Deno)
└── docs/               # توثيق كامل
```

> ⚠️ **مهم**: `packages/db` (Drizzle) **محذوف تماماً**. استخدم Supabase RPCs فقط.

### 1.3 المسؤوليات

| الطبقة | المسؤول | تقنية |
|--------|---------|-------|
| Presentation | واجهة المستخدم | Next.js (Admin), Expo (Mobile) |
| Service | تنسيق العمليات | Edge Functions (Deno) |
| Data/Logic | المنطق وقواعد البيانات | PostgreSQL RPCs |
| Core | التحقق والأنواع | Zod Schemas |

---

## 2. قواعد الأمان الحرجة ⚠️

### 2.1 استخدام `app_metadata` فقط

```typescript
// ❌ خطر! user_metadata يمكن للعميل تعديله
const role = user.user_metadata?.role;

// ✅ صحيح! app_metadata يكتبها admin فقط
const role = user.app_metadata?.role;
```

### 2.2 الدوال الحساسة يجب أن تكون SECURITY DEFINER

```sql
-- ✅ صحيح
CREATE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 2.3 لا تستخدم `user_metadata` مطلقاً

```typescript
// ممنوع منعاً باتاً!
user.user_metadata?.role
auth.jwt().user_metadata?.role
```

### 2.4 تأمين مسارات البحث وصلاحيات الدوال (Functions & RLS Hardening)

* **منع mutable search path:** عند كتابة أو تعديل أي دالة في PostgreSQL، يجب دائماً وضع `SET search_path = public` (أو المخطط المحدد) صراحةً لمنع ثغرات مسارات البحث المتغيرة.
* **تحديد صلاحيات التنفيذ (Execution Privileges):**
  * يجب دائماً سحب صلاحيات التنفيذ العامة عن الدوال الحساسة لمنع استدعائها بشكل مجهول:
    ```sql
    REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) FROM PUBLIC;
    GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) TO authenticated, service_role;
    ```
  * دوال التريجرات (Trigger Functions) لا يجوز إتاحتها للـ RPC إطلاقاً. يجب سحب صلاحيات التنفيذ منها بالكامل:
    ```sql
    REVOKE EXECUTE ON FUNCTION public.sync_driver_role_promotion() FROM PUBLIC, anon, authenticated;
    ```
* **حظر كائنات العرض غير الآمنة (No Security Definer Views in Public):** يمنع تماماً إنشاء Views بـ `SECURITY DEFINER` داخل مخطط `public` لأنها تنكشف تلقائياً لواجهة البرمجة (PostgREST API) وتُسرب بيانات حساسة دون حماية.
* **حظر سياسات RLS المفتوحة (No Blanket RLS Policies for Write Operations):**
  * يمنع استخدام سياسات إدخال أو تعديل مفتوحة دائماً مثل `WITH CHECK (true)` للجداول الحساسة.
  * يجب تقييد الإدخال للأدوار المحددة (مثل `TO service_role` لجدول `notification_log` أو إدراج شروط تحقق حقيقية مثل `WITH CHECK (email IS NOT NULL)`).

---

## 3. قاعدة البيانات — مصدر الحقيقة

### 3.1 Supabase Migrations هي المصدر الوحيد

```
❌ لا تعدل قاعدة البيانات مباشرة
❌ لا تستخدم Drizzle أو أي ORM
✅ استخدم Supabase RPCs فقط
✅ اكتب Migration لكل تغيير
```

### 3.2 نمط تسمية Migrations

```
YYYYMMDDNN_description.sql

مثال:
20260524000001_comprehensive_fix.sql
20260523000005_fix_get_my_conversations.sql
```

### 3.3 الحوكمة

- `supabase db push` تقرأ من `supabase/migrations/`
- كل تغيير على DB = Migration جديد
- **لا استثناءات** مهما كان الأمر العاجل

---

## 4. نظام التراخيص (License System) 🎫

### 4.1 كيف يعمل

```
Admin                               Student
  │                                    │
  │  create_license_batch()            │
  │  ├─ quantity: 100                  │
  │  ├─ route_id: XXX                  │
  │  └─ codes: [A1B2C3D4, ...] (8 chars)│
  │                                    │
  │                          activate_license("A1B2C3D4")
  │                                    │
  │  1. Lock license row (FOR UPDATE NOWAIT)
  │  2. Check status = 'active'         │
  │  3. Mark as 'used' + create subscription
  │  4. Deduct seat from route
```

### 4.2 الجداول الرئيسية

| الجدول | الوصف |
|--------|-------|
| `license_batches` | دفعة تراخيص (أدمن يضيفها) |
| `licenses` | أكواد التراخيص الفردية |
| `subscriptions` | اشتراكات الطلاب (مرتبطة بالـ route) |

### 4.3 طول كود الترخيص = 8 أحرف بالضبط

```typescript
// packages/core/index.ts
export const LicenseSchema = z.object({
  code: z.string().length(8),  // ليس 12!
});
```

---

## 5. State Machine — حالات الرحلة

### 5.1 الحالات والانتقالات

```
┌──────────────────────────────────────────────────────────────┐
│                     Trip State Machine                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  scheduled ─────► driver_waiting ─────► in_transit ─────► completed │
│      │                  │                  │                 │
│      │                  │                  │                 │
│      ▼                  ▼                  ▼                 ▼
│   absent            cancelled           cancelled          (end)
│      │                                    │
│      └──────────────► cancelled ◄────────┘
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 ملاحظات مهمة

| القاعدة | التوضيح |
|---------|---------|
| `in_transit` → `absent` | **ممنوع!** لا يمكن تسجيل غياب بعد الانطلاق |
| `in_transit` → `cancelled` | **مسموح** (حالات الطوارئ فقط) |
| `absent` → `cancelled` | **مسموح** |
| Admin يمكنه إلغاء `scheduled` و `driver_waiting` | لا يمكنه إلغاء `in_transit` |

---

## 6. المقاعد والاشتراكات

### 6.1 المقاعد تتبع الاشتراك وليس الرحلة

```
subscription.status = 'active'
    │
    ├── route.available_seats decremented
    │
    └── student can board ANY trip on that route
```

### 6.2 استعادة المقعد

```sql
-- عند إلغاء الاشتراك
UPDATE routes
SET available_seats = LEAST(capacity, available_seats + 1)
WHERE id = v_route_id;
```

---

## 7. العمليات الحساسة (Concurrency)

### 7.1 الـ Locking Pattern

```sql
-- 1. Lock الصف
SELECT * FROM subscriptions WHERE id = p_id FOR UPDATE NOWAIT;

-- 2. Check
IF v_sub.status != 'active' THEN
  RAISE EXCEPTION '...';
END IF;

-- 3. Update
UPDATE subscriptions SET status = 'cancelled' WHERE id = p_id;
```

### 7.2 Idempotency في Edge Functions

```typescript
// استخدم idempotency key
const idempotencyKey = req.headers.get('idempotency-key');
if (idempotencyKey) {
  const existing = await checkAuditLog(idempotencyKey);
  if (existing) return cachedResponse;
}
```

---

## 8. Rate Limiting

### 8.1 المتطلبات

- استخدم جدول `rate_limits` في DB (وليس Map في الذاكرة)
- Edge Functions تطبق rate limiting قبل أي عملية

### 8.2 الـ RPC

```sql
check_rate_limit(p_user_id, p_action, p_limit, p_window_seconds)
```

---

## 9. أنواع البيانات (Types)

### 9.1 صارم snake_case

```typescript
// ✅ صحيح
{ route_id: "uuid", driver_id: "uuid" }

// ❌ خطأ
{ routeId: "uuid", driverId: "uuid" }
```

### 9.2 Zod هي مصدر truth

```typescript
// Edge Functions تستخدم @uniride/core للتحقق
import { TripUpdateRequest } from '../../../packages/core/index.ts';
const parsed = TripUpdateRequest.safeParse(payload);
```

### 9.3 لا تستخدم `any`

```typescript
// ❌ ممنوع
const data: any = ...

// ✅ صحيح
const data: z.infer<typeof TripSchema> = ...
```

---

## 10. Mobile (Expo) — قواعد خاصة

### 10.1 Zustand Hydration

```typescript
// _layout.tsx
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  const hydrate = async () => {
    await persistedStore.persist;
    setHydrated(true);
  };
  hydrate();
}, []);

// لا redirect حتى يتم Hydration
if (!hydrated) return <Loading />;
```

### 10.2 تجنب inline functions

```tsx
// ❌ خطأ (يسبب re-render)
renderItem={(item) => <Text>{item.name}</Text>}

// ✅ صحيح
const renderItem = useCallback(({ item }) => <Text>{item.name}</Text>, []);
```

### 10.3 i18n & RTL

- لا تضع نصوص صلبة في الكود
- استخدم مفاتيح الترجمة من `@sair/core` 

---

## 11. Supabase Projects

| البيئة | ref | الملف |
|--------|-----|-------|
| Production | `zpcvvyxtmxzplmojobbv` | `.temp/linked-project` |
| Local dev | `pfjsqgqrxnrlrfnchnqf` | `.env` |

---

## 12. قائمة RPCs الرئيسية

| RPC | الغرض | الأمان |
|-----|-------|--------|
| `activate_license(code)` | تفعيل ترخيص | student only |
| `create_trip(route_id, scheduled_at)` | إنشاء رحلة | driver + verified |
| `admin_cancel_trip(trip_id)` | إلغاء رحلة | admin only |
| `submit_rating(trip_id, rating, comment)` | تقييم | student only |
| `cancel_subscription(subscription_id)` | إلغاء اشتراك | student/admin |
| `request_payout(amount)` | طلب صرف | driver only |
| `get_dashboard_stats()` | إحصائيات | admin only |

---

## 13. قائمة Edge Functions

| Function | الغرض |
|----------|-------|
| `trip-engine` | تحديث حالة الرحلة + GPS |
| `send-notification` | إرسال push notifications |
| `zaincash-webhook` | معالجة الدفع (معطل حالياً) |
| `zaincash-checkout` | إنشاء طلب دفع (معطل) |
| `log-error` | تسجيل الأخطاء |

---

## 14. الجداول الرئيسية

| الجدول | الوصف | RLS |
|--------|-------|-----|
| `profiles` | بيانات المستخدمين | ✅ |
| `drivers` | بيانات السائقين | ✅ |
| `routes` | الخطوط والمقاعد | ✅ |
| `subscriptions` | اشتراكات الطلاب | ✅ |
| `trips` | الرحلات الفعلية | ✅ |
| `payments` | سجلات الدفع | ✅ |
| `audit_logs` | سجل التدقيق | ✅ |
| `ratings` | التقييمات | ✅ |
| `messages` | الرسائل | ✅ |
| `conversations` | المحادثات | ✅ |
| `notification_log` | سجل الإشعارات | ✅ |

---

## 15. الـ Triggers

| Trigger | الجدول | الوظيفة |
|---------|--------|---------|
| `set_trips_updated_at` | trips | تحديث updated_at |
| `update_payments_updated_at` | payments | تحديث updated_at |
| `update_conversations_updated_at` | conversations | تحديث updated_at |
| `on_driver_created` | drivers | sync role to auth |
| `on_driver_deleted` | drivers | remove from auth |
| `enforce_profile_privileged_fields_trigger` | profiles | منع تعديل privileged fields |
| `on_profile_role_changed` | profiles | sync role to auth |

---

## 16. CI/CD & Security

### 16.1 ممنوع

- Auto-merge لـ main
- Auto-PR بدون مراجعة
- secrets في الكود

### 16.2 مطلوب

- Migration لكل تغيير
- مراجعة الأكواد
- E2E tests شاملة

---

## 17. ملخص سريع للـ Agent

```
┌─────────────────────────────────────────────────────────────┐
│                    Quick Reference                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [قاعدة البيانات]                                            │
│  - Migrations = Source of Truth                              │
│  - لا Drizzle/ORM                                            │
│  - snake_case دائماً                                        │
│                                                             │
│  [الأمان]                                                    │
│  - app_metadata (وليس user_metadata)                        │
│  - SECURITY DEFINER للدوال الحساسة                          │
│  - FOR UPDATE NOWAIT للـ locking                            │
│                                                             │
│  [المشروع]                                                   │
│  - لا UI جديد (الواجهة مكتملة)                              │
│  - ركز على Backend/Logic/State                               │
│  - لا any                                                    │
│  - i18n keys للنصوص                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**آخر تحديث**: 2026-05-24