# Sair v2 — منصة النقل الذكي للجامعة

## التوثيق الهندسي الشامل

---

## الفهرس (Table of Contents)

1. [نظرة عامة على المشروع](#1-نظرة-عامة-على-المشروع)
2. [البنية المعمارية](#2-البنية-المعمارية)
3. [قاعدة البيانات والمخطط](#3-قاعدة-البيانات-والمخطط)
4. [آليات الأمان والتحكم بالوصول](#4-آليات-الأمان-والتحكم-بالوصول)
5. [الوظائف الحدية (Edge Functions)](#5-الوظائف-الحدية-edge-functions)
6. [إدارة الحالة وحالة عدم الاتصال](#6-إدارة-الحالة-وحالة-عدم-الاتصال)
7. [خطوط الأنابيب (CI/CD)](#7-خطوط-الأنابيب-cicd)
8. [دليل العمليات والمسار التقني](#8-دليل-العمليات-والمسار-التقني)
9. [هيكل المشروع والملفات الرئيسية](#9-هيكل-المشروع-والملفات-الرئيسية)

---

## 1. نظرة عامة على المشروع

### 1.1 التعريف

**Sair** هو منصة نقل ذكي للطلاب الجامعيين في العراق. تعمل على ربط الطلاب بالسائقين عبر نظام حجز المقاعد المتزامن مع تتبع GPS الحي للحافلات.

### 1.2 الحزم والتقنيات

| الحزمة      | التقنية                           | الإصدار                         |
| ----------- | --------------------------------- | ------------------------------- |
| **Root**    | pnpm workspaces                   | 10.0.0                          |
| **Admin**   | Next.js + React + MUI + Refine    | Next.js 16.2.6, React 19        |
| **Mobile**  | Expo + React Native + Expo Router | Expo 54, RN 0.81.5              |
| **Core**    | Zod schemas, i18n                 | TypeScript 5.4.5                |
| **DB**      | Supabase PostgreSQL (Production)  | -                               |
| **Testing** | Vitest (unit) + Playwright (E2E)  | Vitest 1.6.0, Playwright 1.59.1 |

### 1.3 أدوار المستخدمين

| الدور       | الوصف        | الصلاحيات                                     |
| ----------- | ------------ | --------------------------------------------- |
| **admin**   | مدير النظام  | لوحة تحكم كاملة، إدارة جميع الكيانات          |
| **student** | طالب جامعي   | حجز المقاعد، عرض الاشتراكات، تتبع الرحلة      |
| **driver**  | سائق الحافلة | بدء/إنهاء الرحلات، إرسال موقع GPS، عرض الركاب |

### 1.4 حالات الرحلة (Trip State Machine)

```
       scheduled ────────► driver_waiting ────────► in_transit ────────► completed
         │                      │                       │
         ├──────────────────────┼───────────────────────┼──────────────► cancelled
         │                      │
         ▼                      ▼
       absent                 absent
         │
         ▼
     cancelled
```

الانتقالات المسموحة:

- `scheduled` → `driver_waiting`, `absent`, `cancelled`
- `driver_waiting` → `in_transit`, `absent`, `cancelled`
- `in_transit` → `completed`, `cancelled` (يسمح بإلغاء الرحلة أثناء السير لحالات الطوارئ)
- `absent` → `cancelled`
- `completed`, `cancelled` → (حالة نهائية، لا توجد انتقالات إضافية)
- **ملاحظة:** يمنع منعاً باتاً الانتقال المباشر من `in_transit` إلى `absent`.

---

## 2. البنية المعمارية

### 2.1 بنية المجلدات (Monorepo)

```
sair/
├── apps/
│   ├── admin/                    # لوحة تحكم administrators
│   │   ├── src/
│   │   │   ├── app/             # App Router pages
│   │   │   ├── components/      # مكونات MUI
│   │   │   ├── providers/       # AuthProvider, SupabaseClient
│   │   │   └── refine/          # إعدادات Refine resources
│   │   ├── package.json
│   │   └── ...
│   └── mobile/                  # تطبيق React Native
│       ├── src/
│       │   ├── app/            # Expo Router screens
│       │   ├── hooks/          # useTrips, useRoutes, useNetworkStatus
│       │   ├── lib/            # supabase client
│       │   └── stores/         # Zustand stores
│       └── ...
├── packages/
│   └── core/                    # schemas, i18n, theme
│       └── index.ts            # UserRole, TripStatus, Translations...
├── supabase/
│   ├── functions/             # Edge Functions (Deno)
│   │   ├── trip-engine/       # تحديث حالة الرحلة + GPS
│   │   └── atomic-booking/    # حجز المقعد الذري
│   └── migrations/            # SQL migrations (المصدر الحقيقي للإنتاج)
│       ├── 2026051004_phase0_fixes.sql
│       └── 2026051005_critical_fixes.sql
├── .github/workflows/         # CI/CD pipelines
│   ├── ci.yml                 # lint, typecheck, tests, build
│   ├── deploy.yml             # migrations + edge functions
│   ├── e2e.yml                # Playwright API tests
│   ├── pr-check.yml           # PR validation
│   ├── security.yml           # pnpm audit + SQL review
│   └── setup-branch-protection.yml
├── tests/                      # اختبارات Playwright
├── docs/v2/                   # توثيق إضافي
└── package.json               # pnpm workspace root
```

### 2.2 نمط تدفق البيانات

```
┌─────────────────────────────────────────────────────────────────┐
│                        طلب HTTP                                 │
│                  (Edge Function / REST)                         │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Supabase Auth (JWT)                            │
│            ── التحقق من token + استخراج user.id ──             │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│           Row Level Security (RLS)                              │
│    ── تطبيقPolicies على مستوى الصفوف في PostgreSQL ──         │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│           PostgreSQL Functions (RPCs)                           │
│  ── reserve_seat(), update_trip_status(), check_rate_limit() ── │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     النتيجة                                     │
│              (JSON Response / Subscription)                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 مصدر الحقيقة لقاعدة البيانات (Supabase Migrations)

تمت إزالة `packages/db` و Drizzle ORM بالكامل من المشروع لتبسيط البنية البرمجية ومنع تشتت منطق البيانات.

- **Supabase Migrations هي المصدر الوحيد للحقيقة:** تتم إدارة وتعديل هيكل قاعدة البيانات بالكامل عبر ملفات SQL في مجلد `supabase/migrations/` بالنمط `YYYYMMDDNN_description.sql`.
- يتم دفع التغييرات للإنتاج باستخدام الأمر `supabase db push`.

---

## 3. قاعدة البيانات والمخطط

### 3.1 جداول قاعدة البيانات

#### `profiles` — ملفات المستخدمين

```sql
id              UUID PRIMARY KEY (FK auth.users)
full_name       TEXT NOT NULL
phone           TEXT NOT NULL
role            TEXT NOT NULL CHECK (role IN ('admin','student','driver'))
institution_id  UUID NULL
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### `drivers` — بيانات السائقين والمركبات

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID NOT NULL UNIQUE (FK profiles.id)
license_number  TEXT NOT NULL
vehicle_model   TEXT NOT NULL
vehicle_plate   TEXT NOT NULL
capacity        INT NOT NULL DEFAULT 40
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### `routes` — خطوط النقل

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
driver_id       UUID NOT NULL (FK drivers.id)
title           TEXT NOT NULL
start_location  TEXT NOT NULL
end_location    TEXT NOT NULL
price           BIGINT NOT NULL  -- بالدينار العراقي
capacity        INT NOT NULL
available_seats INT NOT NULL
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### `subscriptions` — اشتراكات الطلاب

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
student_id      UUID NOT NULL (FK profiles.id)
route_id        UUID NOT NULL (FK routes.id)
status          TEXT NOT NULL CHECK (status IN ('pending','active','expired','cancelled'))
start_date      DATE NOT NULL
end_date        DATE NOT NULL
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### `trips` — رحلات فعلية

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
route_id        UUID NOT NULL (FK routes.id)
driver_id       UUID NOT NULL (FK drivers.id)
status          TEXT NOT NULL DEFAULT 'scheduled'
scheduled_at    TIMESTAMPTZ NOT NULL
started_at      TIMESTAMPTZ NULL
ended_at        TIMESTAMPTZ NULL
last_lat        NUMERIC(10,7) NULL
last_lng        NUMERIC(10,7) NULL
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### `audit_logs` — سجل المراجعة

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID NOT NULL (FK auth.users)
action          TEXT NOT NULL
resource        TEXT NOT NULL
resource_id     UUID NULL
details         JSONB NULL
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### `rate_limits` — التحكم في معدل الطلبات

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID NOT NULL (FK auth.users)
action          TEXT NOT NULL
window_start    TIMESTAMPTZ NOT NULL DEFAULT NOW()
request_count   INT NOT NULL DEFAULT 1
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### 3.2 العلاقات بين الجداول

```
auth.users
    │
    └── profiles (1:1)
            │
            ├── drivers (1:1) ────── routes (1:M) ────── subscriptions (M:1) ──── profiles (students)
            │       │
            │       └── trips (1:M)
            │
            └── subscriptions (1:M) (كمسافر)
```

### 3.3 الدوال المخزنة (Stored Procedures / RPCs)

| الدالة                                                         | الغرض                                               | معلجات             |
| -------------------------------------------------------------- | --------------------------------------------------- | ------------------ |
| `reserve_seat(route_id, student_id)`                           | حجز مقعد بشكل ذري باستخدام `FOR UPDATE` lock        | تمنع الحجز المزدوج |
| `update_trip_status(trip_id, new_status, lat, lng, driver_id)` | تحديث حالة الرحلة مع التحقق من state machine        | يحمي transitions   |
| `update_trip_location(trip_id, lat, lng)`                      | تحديث موقع GPS فقط                                  | لا يغير الحالة     |
| `get_dashboard_stats()`                                        | إحصائيات للوحة التحكم (بدلاً من تحميل كل البيانات)  | تُرجع JSON         |
| `check_rate_limit(action, limit, window_seconds)`              | تحديد معدل الطلبات لكل مستخدم                       | DB-backed          |
| `ping()`                                                       | فحص الاتصال بالشبكة                                 | تُرجع TRUE دائماً  |
| `get_my_role()`                                                | إرجاع role من `app_metadata` (وليس `user_metadata`) | آمن                |
| `log_audit(...)`                                               | تسجيل فعل في audit_logs                             | للتتبع             |

### 3.4 الـ Triggers

| Trigger                  | الجدول          | الوظيفة                                                                                     |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------- |
| `set_trips_updated_at`   | `trips`         | تحديث `updated_at` تلقائياً عند أي تغيير                                                    |
| `on_subscription_cancel` | `subscriptions` | إعادة المقاعد المتاحة للخط عند الإلغاء/الانتهاء                                             |
| `on_profile_update`      | `profiles`      | مزامنة الاسم إلى auth metadata                                                              |
| `on_driver_created`      | `drivers`       | ترقية دور المستخدم تلقائياً إلى `driver` في `profiles` و `app_metadata` عند إضافة سجل سائق. |
| `on_driver_deleted`      | `drivers`       | إعادة دور المستخدم إلى `student` تلقائياً عند حذف سجل السائق للحفاظ على تناسق الصلاحيات.    |

### 3.5 الفهارس (Indexes)

```sql
idx_profiles_role          ON profiles(role)
idx_profiles_institution   ON profiles(institution_id)
idx_subscriptions_route_status ON subscriptions(route_id, status)
idx_trips_route_status     ON trips(route_id, status)
idx_trips_scheduled        ON trips(scheduled_at)
idx_trips_driver_status    ON trips(driver_id, status)
idx_audit_logs_resource    ON audit_logs(resource, resource_id)
idx_audit_logs_user        ON audit_logs(user_id, created_at DESC)
idx_rate_limits_user_action ON rate_limits(user_id, action, window_start)
```

### 3.6 pg_cron — المهام المجدولة

```sql
-- job: expire_subscriptions
-- frequency: hourly
-- الوظيفة: تحديث حالة الاشتراكات المنتهية ('active' → 'expired')
```

---

## 4. آليات الأمان والتحكم بالوصول

### 4.1 طبقات الأمان

```
الطبقة 1: Supabase Auth (JWT tokens)
الطبقة 2: Row Level Security (RLS) على كل الجداول
الطبقة 3: app_metadata.role (وليس user_metadata)
الطبقة 4: Edge Function Auth Verification
الطبقة 5: Rate Limiting (DB-backed)
الطبقة 6: Input Validation (Zod schemas)
```

### 4.2 الـ JWT Claims المستخدمة

```typescript
// من auth.users.app_metadata
{
  "role": "admin" | "student" | "driver"
}

// من auth.jwt()
auth.uid()          // UUID المستخدم الحالي
auth.jwt() -> 'app_metadata' ->> 'role'  // الدور
```

### 4.3 الفرق بين `app_metadata` و `user_metadata`

| الخاصية       | `app_metadata`          | `user_metadata`         |
| ------------- | ----------------------- | ----------------------- |
| **الكتابة**   | admin-only (خادم)       | client-writable         |
| **الأمان**    | ✅ آمن للدور والصلاحيات | ❌ غير آمن              |
| **الاستخدام** | `authProvider.ts`       | ❌ لا تستخدمه للصلاحيات |

> **تحذير:** استخدام `user_metadata.role` للصلاحيات = ثغرة ارتفاع صلاحيات (Privilege Escalation)
> لأن أي مستخدم يمكنه تغيير `user_metadata` من العميل.

### 4.4 سياسات RLS الرئيسية

```sql
-- profiles: المستخدم يرى ملفه فقط، admin يرى الكل
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_my_role() = 'admin');

-- routes: السائق يرى خطوطه، admin يرى الكل
CREATE POLICY "Drivers can view own routes" ON routes
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM drivers WHERE id = driver_id)
    OR get_my_role() = 'admin'
  );

-- subscriptions: الطالب يرى اشتراكاته فقط
CREATE POLICY "Students can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = student_id);
```

### 4.5 التحكم في التزامنية (Concurrency)

**المشكلة:** ماذا يحدث إذا حجز طالبان نفس المقعد في نفس اللحظة؟

**الحل:** `FOR UPDATE` Pessimistic Locking

```sql
CREATE OR REPLACE FUNCTION reserve_seat(p_route_id UUID, p_student_id UUID) RETURNS UUID AS $$
DECLARE
  v_available INT;
  v_existing UUID;
  v_sub_id UUID;
BEGIN
  -- قفل الصف preventing concurrent modifications
  SELECT available_seats INTO v_available
  FROM routes
  WHERE id = p_route_id
  FOR UPDATE;

  -- فحص المقاعد المتاحة
  IF v_available <= 0 THEN
    RAISE EXCEPTION 'No seats available';
  END IF;

  -- فحص الاشتراك الحالي
  SELECT id INTO v_existing
  FROM subscriptions
  WHERE student_id = p_student_id AND route_id = p_route_id AND status = 'active';

  IF v_existing IS NOT NULL THEN
    RAISE EXCEPTION 'Already subscribed to this route';
  END IF;

  -- خصم المقعد
  UPDATE routes SET available_seats = available_seats - 1 WHERE id = p_route_id;

  -- إنشاء الاشتراك
  INSERT INTO subscriptions (student_id, route_id, status, start_date, end_date)
  VALUES (p_student_id, p_route_id, 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
  RETURNING id INTO v_sub_id;

  RETURN v_sub_id;
END;
$$ LANGUAGE plpgsql;
```

### 4.6 Rate Limiting (تحديد معدل الطلبات)

**المشكلة:** Deno cold start يمسح `Map()` في الذاكرة.

**الحل:** DB-backed rate limiting

```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INT NOT NULL DEFAULT 1
);

CREATE OR REPLACE FUNCTION check_rate_limit(
  p_action TEXT, p_limit INT, p_window_seconds INT
) RETURNS BOOLEAN AS $$
DECLARE v_count INT; v_window_start TIMESTAMPTZ;
BEGIN
  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  DELETE FROM rate_limits WHERE user_id = auth.uid() AND action = p_action AND window_start < v_window_start;
  SELECT COALESCE(SUM(request_count), 0) INTO v_count FROM rate_limits
  WHERE user_id = auth.uid() AND action = p_action AND window_start >= v_window_start;
  IF v_count >= p_limit THEN RETURN FALSE; END IF;
  INSERT INTO rate_limits (user_id, action, window_start, request_count)
  VALUES (auth.uid(), p_action, NOW(), 1);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**الحدود:**

- `trip-engine`: 30 طلب / 60 ثانية
- `atomic-booking`: 10 طلب / 60 ثانية

### 4.7 الـ Idempotency

**المشكلة:** إعادة إرسال نفس الطلب (network retry) قد تنفذ العملية مرتين.

**الحل:** `idempotency-key` header

```typescript
// في Edge Function
const idempotencyKey = req.headers.get('idempotency-key');

if (idempotencyKey) {
  const { data: existingAudit } = await supabase
    .from('audit_logs')
    .select('id')
    .eq('user_id', user.id)
    .eq('action', 'trip_status_change')
    .eq('resource_id', tripId)
    .eq('details', JSON.stringify({ idempotencyKey }))
    .single();

  if (existingAudit) {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Status already updated (idempotent response)',
        idempotent: true,
      }),
      { status: 200, headers },
    );
  }
}
```

---

## 5. الوظائف الحدية (Edge Functions)

### 5.1 `trip-engine` — محرك الرحلة

**Endpoint:** `/functions/v1/trip-engine`

**الوظيفة:** يتعامل مع انتقالات حالات الرحلات للسائقين

```typescript
// طلب
{
  tripId: UUID,
  newStatus: 'scheduled' | 'driver_waiting' | 'in_transit' | 'completed' | 'absent' | 'cancelled',
  lat: number,
  lng: number
}

// Headers
Authorization: Bearer <JWT>
idempotency-key: <unique-key>  // optional

// استجابة
{ success: true }
```

**خطوات المعالجة:**

1. التحقق من Authorization header
2. التحقق من Rate limit (30/60s)
3. التحقق من أن المستخدم سائق (`drivers` table)
4. التحقق من idempotency key
5. استدعاء `update_trip_status()` RPC
6. تسجيل audit log
7. إرجاع النتيجة

### 5.2 `atomic-booking` — الحجز الذري

**Endpoint:** `/functions/v1/atomic-booking`

**الوظيفة:** حجز مقعد لطالب بشكل آمن من التزامنية

```typescript
// طلب
{
  routeId: UUID,
  studentId: UUID  // يجب أن يطابق JWT user.id
}

// Headers
Authorization: Bearer <JWT>
idempotency-key: <unique-key>  // optional

// استجابة
{ success: true, subscriptionId: UUID }
```

**خطوات المعالجة:**

1. التحقق من Authorization header
2. التحقق من Rate limit (10/60s)
3. التحقق من UUID format
4. التحقق من أن `studentId === user.id` (لا يمكن الحجز لشخص آخر)
5. التحقق من idempotency (اشتراك موجود مسبقاً)
6. استدعاء `reserve_seat()` RPC
7. تسجيل audit log
8. إرجاع النتيجة

---

## 6. إدارة الحالة وحالة عدم الاتصال

### 6.1 تطبيقات إدارة الحالة

| التطبيق    | الحل                     | التفاصيل                            |
| ---------- | ------------------------ | ----------------------------------- |
| **Mobile** | Zustand 5 + AsyncStorage | 4 stores: auth, trip, booking, i18n |
| **Admin**  | Refine + React Hook Form | Server state via Refine hooks       |

### 6.2 Zustand Stores (Mobile)

```typescript
// stores/authStore.ts
{
  user: User | null,
  role: 'admin' | 'student' | 'driver' | null,
  setUser: (user) => void,
  logout: () => void
}

// stores/tripStore.ts
{
  activeTrips: Trip[],
  currentTrip: Trip | null,
  setActiveTrips: (trips) => void,
  updateTrip: (trip) => void
}

// stores/bookingStore.ts
{
  pendingBooking: { routeId, idempotencyKey } | null,
  setPendingBooking: (booking) => void,
  clearPendingBooking: () => void
}

// stores/i18nStore.ts
{
  language: 'ar' | 'en',
  setLanguage: (lang) => void
}
```

### 6.3 التعامل مع عدم الاتصال (Offline GPS Queue)

```
┌──────────────────┐      GPS update       ┌──────────────────┐
│   في حالة اتصال  │ ──────────────────►  │  update_trip_     │
│                  │                       │  location RPC     │
└──────────────────┘                       └──────────────────┘

┌──────────────────┐      GPS update       ┌──────────────────┐
│  انقطع الاتصال   │ ──────────────────►  │  AsyncStorage    │
│                  │                       │  gps_offline_queue│
└──────────────────┘                       └────────┬─────────┘
                                                   │ After 5s
                                                   ▼
                                          flushGpsQueue()
                                          (max 3 retries per item)
```

**الكود:**

```typescript
const GPS_QUEUE_KEY = 'gps_offline_queue';

async function queueLocationUpdate(tripId: string, lat: number, lng: number) {
  const item: QueuedLocation = { tripId, lat, lng, timestamp: Date.now(), retries: 0 };
  const existing = await AsyncStorage.getItem(GPS_QUEUE_KEY);
  const queue: QueuedLocation[] = existing ? JSON.parse(existing) : [];
  queue.push(item);
  await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(queue));
}
```

### 6.4 فحص حالة الشبكة

**المشكلة:** استعلام عادي قد يفشل بسبب RLS (يكون هناك false negative)

**الحل:** استخدام `ping()` RPC الذي يعمل كـ `SECURITY DEFINER`

```typescript
// useNetworkStatus.ts — يتحقق كل 30 ثانية
async function checkNetwork() {
  try {
    const { error } = await supabase.rpc('ping');
    setIsOnline(!error);
  } catch {
    setIsOnline(false);
  }
}
```

### 6.5 Realtime Subscriptions

```typescript
// تتبع الرحلات النشطة
const channel = supabase
  .channel('trips-active-realtime')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'trips',
    },
    (payload) => {
      // INSERT: أضف للـ list إذا كانت نشطة
      // UPDATE: حدّث العنصر أو احذفه إذا اكتملت
      // DELETE: احذف من الـ list
    },
  )
  .subscribe();
```

---

## 7. خطوط الأنابيب (CI/CD)

### 7.1 ملخص Workflows

| Workflow                        | Trigger             | الوظيفة                                       |
| ------------------------------- | ------------------- | --------------------------------------------- |
| **ci.yml**                      | push/PR main        | lint → typecheck → test → build               |
| **pr-check.yml**                | PR opened           | التحقق من .env، console.log، تسمية migrations |
| **deploy.yml**                  | CI success / manual | تطبيق Migrations + نشر Edge Functions         |
| **e2e.yml**                     | push main / manual  | Playwright API tests                          |
| **security.yml**                | weekly / manual     | pnpm audit + مراجعة SQL                       |
| **setup-branch-protection.yml** | manual              | إعداد حماية الفرع                             |

### 7.2 CI Pipeline (`ci.yml`)

```
Push/PR to main
      │
      ▼
┌─────────────────────┐
│ lint-and-typecheck  │  ──► format --check
│                     │  ──► pnpm typecheck
└──────────┬──────────┘
           │ success
           ▼
┌─────────────────────┐
│    unit-tests       │  ──► vitest --coverage
│                     │     thresholds: 60% lines, 50% branches/functions
└──────────┬──────────┘
           │ success
           ▼
┌─────────────────────┐
│    build-admin      │  ──► Next.js production build
│                     │     (placeholder env vars)
└──────────┬──────────┘
           │ success
           ▼
┌─────────────────────┐
│     ci-success      │  ──► يتحقق من نجاح كل الـ jobs
└─────────────────────┘
```

### 7.3 Deploy Pipeline (`deploy.yml`)

```
CI success
    │
    ▼
┌─────────────────────────────────────────┐
│  setup-supabase-cli  →  link project   │
└────────────────────┬───────────────────┘
                     ▼
┌────────────────────┐
│  push migrations   │  ──► supabase db push
│  (production DB)   │     (تطبيق SQL migrations)
└────────────────────┬───────────────────┘
                     ▼
┌────────────────────────────┐
│  deploy edge functions     │  ──► deploy trip-engine
│                            │  ──► deploy atomic-booking
└────────────────────────────┬────────────────────┘
                             ▼
┌────────────────────────────────────────────┐
│  set secrets                         │
│  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY │
│  ADMIN_URL                                      │
└────────────────────────────────────────────┘
                             ▼
                    Verify Functions Active
```

### 7.4 PR Check (`pr-check.yml`)

```
PR opened/synced
      │
      ▼
┌─────────────────┐
│ .env detection  │  ──► Exit 1 if .env found in diff
└────────┬────────┘
         ▼
┌─────────────────┐
│ console.log     │  ──► Warning only (لا يمنع الـ merge)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Migration naming│  ──► Pattern: YYYYMMDDNN_name.sql
└────────┬────────┘
         ▼
┌─────────────────┐
│ PR description  │  ──► Exit if < 10 chars
└─────────────────┘
```

### 7.5 Branch Protection على `main`

```
main branch
     │
     ├─ Require pull request before merge    ✅
     ├─ Require at least 1 approval          ✅
     ├─ Require CI checks to pass            ✅ (ci.yml)
     ├─ Require linear history              ✅ (rebase only)
     ├─ Include admin in protection         ✅
     └─ Block force pushes                  ✅
```

---

## 8. دليل العمليات والمسار التقني

### 8.1 كيفية رفع تصحيح (Bug Fix)

```
1. أنشئ فرع من main:
   git checkout -b fix/description

2. اكتب الكود وأصلح الـ bug

3. تأكد من:
   pnpm format --check    // التنسيق
   pnpm typecheck         // الأنواع
   pnpm test              // الاختبارات

4. ارفع الفرع واصنع PR:
   git push -u origin fix/description
   gh pr create --title "fix: description" --body "..."

5. الـ PR-check يعمل تلقائياً:
   - يفحص .env
   - يفحص console.log
   - يتحقق من تسمية migration
   - يتحقق من وصف PR

6. بعد الموافقة والـ CI passed:
   - Squash and merge
   - deploy.yml يعمل تلقائياً

7. Migration تطبق على Supabase production
```

### 8.2 كيفية إضافة Migration جديد

```
1. أنشئ ملف جديد في supabase/migrations/
   Pattern: YYYYMMDDNN_descriptive_name.sql

   مثال: 2026051101_add_new_table.sql

2. اكتب SQL:
   CREATE TABLE IF NOT EXISTS ...;
   CREATE POLICY "..." ON ...;
   CREATE INDEX ...;

3. اختبر محلياً (إن أمكن)

4. ارفع وقم بـ PR

5. بعد merge، deploy.yml يطبق Migration تلقائياً:
   supabase db push
```

### 8.3 كيفية نشر Edge Function جديد

```
1. أنشئ Function جديد في supabase/functions/
   supabase/functions/my-function/index.ts

2. اكتب الكود (Deno):
   Deno.serve(async (req) => { ... })

3. أضف Secrets إن需要的:
   supabase secrets set MY_SECRET=value

4. ارفع وقم بـ PR

5. بعد merge، deploy.yml ينشر:
   supabase functions deploy my-function --project-ref <ref>
```

### 8.4 How to Fix a CI Failure

```
1. Check the failing workflow in GitHub Actions tab

2. Most common causes:

   a) Format error:
      pnpm format --write "**/*.ts"
      git add . && git commit --amend --no-edit
      git push --force (only if not pushed yet)

   b) TypeScript error:
      pnpm typecheck
      → Fix the type errors

   c) Test coverage below threshold:
      → Add more tests or adjust thresholds (if justified)

   d) Build error:
      → Check Next.js/Expo build logs

3. Fix, commit, push:
   git add . && git commit -m "fix: ci issue"
   git push
```

### 8.5 ملخص الأوامر الأساسية

```bash
# Setup
pnpm install
pnpm dev                    # تشغيل كل التطبيقات

# Code Quality
pnpm format --write          # تنسيق الكود
pnpm typecheck              # فحص الأنواع
pnpm test                   # تشغيل الاختبارات
pnpm test -- --coverage     # مع التغطية
pnpm build                  # بناء كل التطبيقات

# Database
pnpm db:push                # Drizzle: رفع schema
pnpm db:studio              # Drizzle: فتح Studio
pnpm seed                   # إضافة بيانات تجريبية

# Supabase CLI
supabase db push            # تطبيق migrations على production
supabase functions deploy <name>
supabase secrets set KEY=value

# GitHub
gh pr create --title "..." --body "..."
gh pr merge <number> --squash
gh run watch                # مراقبة الـ CI
```

---

## 9. هيكل المشروع والملفات الرئيسية

### 9.1 الملفات الحرجة

| الملف                                               | الوظيفة                                             |
| --------------------------------------------------- | --------------------------------------------------- |
| `apps/admin/src/providers/authProvider.ts`          | تسجيل دخول admin، التحقق من الدور من `app_metadata` |
| `apps/admin/src/app/page.tsx`                       | لوحة التحكم — تستخدم `get_dashboard_stats()` RPC    |
| `apps/mobile/src/hooks/useTrips.ts`                 | إدارة الرحلات + تتبع GPS + Offline queue            |
| `apps/mobile/src/hooks/useNetworkStatus.ts`         | فحص الشبكة عبر `ping()` RPC                         |
| `apps/mobile/src/hooks/useRoutes.ts`                | جلب الخطوط مع pagination                            |
| `apps/mobile/src/stores/useStore.ts`                | Zustand stores                                      |
| `packages/core/index.ts`                            | Zod schemas, state machine, i18n                    |
| `supabase/functions/trip-engine/index.ts`           | تحديث حالة الرحلة                                   |
| `supabase/functions/atomic-booking/index.ts`        | حجز المقعد                                          |
| `supabase/migrations/2026051005_critical_fixes.sql` | RPCs، indexes، RLS policies                         |

### 9.2 متغيرات البيئة

**Admin (`apps/admin/.env.local`):**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=postgres://...
```

**Mobile (`apps/mobile/.env`):**

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_URL_AND_ANON_KEY=
```

**Supabase Secrets (for Edge Functions):**

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_URL=
```

### 9.3 Supabase Projects

| المشروع          | ref                    | الاستخدام             |
| ---------------- | ---------------------- | --------------------- |
| في `.env` (محلي) | `pfjsqgqrxnrlrfnchnqf` | التطوير المحلي        |
| للإنتاج (linked) | `zpcvvyxtmxzplmojobbv` | Production deployment |

---

## الملحق: خريطة الذاكرة (Mental Model)

```
┌─────────────────────────────────────────────────────────────┐
│                        Sair Platform                         │
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌──────────────┐  │
│  │   Mobile    │     │    Admin    │     │  GitHub      │  │
│  │   (Expo)    │     │  (Next.js)  │     │  (CI/CD)     │  │
│  └──────┬──────┘     └──────┬──────┘     └──────┬───────┘  │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Supabase (Backend-as-a-Service)            ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               ││
│  │  │   Auth   │  │  Postgres │  │Edge Funcs│               ││
│  │  │  (JWT)   │  │  (RLS)    │  │  (Deno)  │               ││
│  │  └──────────┘  └──────────┘  └──────────┘               ││
│  └─────────────────────────────────────────────────────────┘│
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌─────────────┐     ┌─────────────┐     ┌──────────────┐  │
│  │   Student   │     │   Admin     │     │   Driver    │  │
│  │    Role     │     │    Role     │     │    Role     │  │
│  └─────────────┘     └─────────────┘     └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```
