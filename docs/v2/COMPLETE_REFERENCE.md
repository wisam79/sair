# Sair v2 — منصة النقل الذكي للجامعة

## التوثيق الهندسي الشامل والكامل مرجع التشغيل والتصميم

---

## الفهرس (Table of Contents)

1. [نظرة عامة على المشروع](#1-نظرة-عامة-على-المشروع)
2. [البنية المعمارية وهيكل Monorepo](#2-البنية-المعمارية-وهيكل-monorepo)
3. [قاعدة البيانات والمخطط التفصيلي (Database Schema)](#3-قاعدة-البيانات-والمخطط-التفصيلي-database-schema)
4. [آليات الأمان والتحكم بالوصول والتحصين (Security Hardening)](#4-آليات-الأمان-والتحكم-بالوصول-والتحصين-security-hardening)
5. [الوظائف الحدية (Edge Functions)](#5-الوظائف-الحدية-edge-functions)
6. [إدارة الحالة وحالة عدم الاتصال (Offline & State Management)](#6-إدارة-الحالة-وحالة-عدم-الاتصال-offline--state-management)
7. [خطوط الأنابيب والأتمتة (CI/CD Workflows)](#7-خطوط-الأنابيب-والأتمتة-cicd-workflows)
8. [دليل العمليات والمسار التقني للمطورين (Operations Guide)](#8-دليل-العمليات-والمسار-التقني-للمطورين-operations-guide)
9. [هيكل المشروع والملفات الحرجة ومتغيرات البيئة](#9-هيكل-المشروع-والملفات-الحرجة-ومتغيرات-البيئة)

---

## 1. نظرة عامة على المشروع

### 1.1 التعريف

**Sair** هو منصة نقل ذكي متكاملة مصممة خصيصاً لتنظيم وتسهيل نقل الطلاب الجامعيين في العراق. تركز المنصة على حل مشاكل الازدحام والتأخير بالاعتماد على نظام اشتراكات شهري مسبق الدفع (Redeemable Licenses) مرتبط بـ GPS حقيقي للتتبع المباشر وإدارة ذكية للرحلات اليومية من قبل السائقين، بدلاً من نظام حجز الرحلات المباشر الفردي الذي يعاني من مشاكل تزامنية معقدة.

### 1.2 الحزم والتقنيات

| الحزمة / المكون  | التقنية البرمجية               | الإصدار المعتمد                  | الوصف والمهمة                                           |
| :--------------- | :----------------------------- | :------------------------------- | :------------------------------------------------------ |
| **Root**         | pnpm workspaces                | 10.0.0+                          | إدارة وحفظ اعتماديات Monorepo بأداء عالٍ.               |
| **Admin App**    | Next.js + React + Refine + MUI | Next.js 16.2.6، React 19، MUI v6 | لوحة تحكم الإدارة وعرض التقارير والتحكم المالي.         |
| **Mobile App**   | Expo + React Native + Zustand  | Expo 54/55، React Native 0.81    | التطبيق الموحد للطلاب والسائقين مع خرائط وتتبع فوري.    |
| **Core Package** | TypeScript + Zod + i18next     | TypeScript 5.4+، Zod v3          | النواة المشتركة للمخططات، آلة الحالات، ومفاتيح الترجمة. |
| **DB / Backend** | Supabase PostgreSQL            | v15+                             | محرك قاعدة البيانات وإدارة الصلاحيات (RLS & RPCs).      |
| **Testing**      | Vitest + Playwright            | Vitest 1.6.0، Playwright 1.59    | اختبارات الوحدة، التكامل، والـ E2E للـ APIs والسياسات.  |

### 1.3 أدوار المستخدمين (User Roles)

1. **student (الطالب)**:
   - البحث عن خطوط النقل المتاحة والمقاعد الشاغرة.
   - تفعيل التراخيص الشهرية (License Codes) لإنشاء اشتراك نشط.
   - تتبع رحلة الحافلة مباشرة لحظة تحركها.
   - الإبلاغ الطارئ (SOS) في الحالات العاجلة، ومحادثة السائق.
   - تقييم الرحلة والسائق بعد الوصول.

2. **driver (السائق)**:
   - إنشاء وإطلاق الرحلة اليومية المجدولة للخطوط الموكلة إليه.
   - إرسال إحداثيات GPS بشكل دوري للرحلات النشطة.
   - محاذاة ركاب الرحلة وتسجيل الحضور والغياب.
   - تقديم طلبات سحب الأرباح المجمعة من الاشتراكات.

3. **admin (المسؤول)**:
   - إدارة خطوط النقل، وتعيين السائقين وتوثيقهم.
   - توليد دفعات التراخيص (License Batches) وطباعتها.
   - مراقبة وتدقيق سجلات النظام (Audit Logs) والتحليلات والتقارير المالية.
   - البث العام للإشعارات ومتابعة بلاغات الطوارئ النشطة وطلبات الصرف.

### 1.4 آلة حالات الرحلة (Trip State Machine)

تدار دورة حياة الرحلة بدقة فائقة بالاعتماد على آلة حالة صارمة تمنع التجاوزات غير المنطقية:

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

- **scheduled (مجدولة)**: حالة الرحلة الافتراضية بعد إنشائها.
- **driver_waiting (السائق ينتظر)**: يصل السائق لنقطة الانطلاق لتجميع الطلاب.
- **in_transit (أثناء السير)**: انطلقت الرحلة باتجاه الجامعة أو خط العودة.
- **completed (مكتملة)**: الرحلة وصلت لوجهتها النهائية بأمان.
- **absent (غائب)**: السائق أو الحافلة لم تظهر في الوقت المحدد.
- **cancelled (ملغاة)**: تم إلغاء الرحلة بطلب من الإدارة أو السائق (متاح حتى أثناء السير للطوارئ).

---

## 2. البنية المعمارية وهيكل Monorepo

### 2.1 بنية المجلدات

يتميز المشروع بفصل صارم للمسؤوليات لمنع تسرب التبعيات المتعارضة:

```
sair/
├── apps/
│   ├── admin/                    # لوحة التحكم (Next.js)
│   │   ├── src/app/             # مسارات الصفحات للوحة Refine
│   │   ├── src/components/      # مكونات واجهة المستخدم (MUI)
│   │   └── src/providers/       # مزود الهوية والبيانات (Supabase)
│   └── mobile/                  # تطبيق الهاتف الموحد (Expo Router)
│       ├── app/                 # شاشات التطبيق والهيكل التوجيهي
│       └── src/                 # المكونات والخطافات (hooks) ومستودعات Zustand
├── packages/
│   └── core/                    # النواة المشتركة (Shared Core)
│       ├── locales/             # ملفات الترجمة (ar.json / en.json)
│       └── index.ts             # آلة الحالات، مخططات Zod، التحقق
├── supabase/
│   ├── functions/               # الوظائف الحدية (Edge Functions Deno)
│   │   ├── trip-engine/        # محرك الرحلات والإشعارات الفورية
│   │   └── send-notification/  # معالجة بث التنبيهات
│   └── migrations/              # ملفات هجرة SQL (مصدر حقيقة هيكل البيانات)
├── tests/                       # اختبارات الـ API والأمان (Playwright)
└── package.json                 # إعدادات Monorepo وإدارة العمليات
```

### 2.2 نمط تدفق العمليات (Processing Flow)

تتم معالجة العمليات الحساسة بأسلوب دفاعي متعدد الطبقات لضمان التحقق البرمجي والأمني قبل حفظ أي بيانات:

```
[Client Application] ──(Zod Validation)──► [JWT Token Auth] ──► [Edge Function Gateway]
                                                                        │
[PostgreSQL Database] ◄──(RLS & Audit Logs)◄──(Atomic Locking RPC)◄─────┘
```

---

## 3. قاعدة البيانات والمخطط التفصيلي (Database Schema)

قاعدة البيانات هي المكون الأساسي لحفظ المنطق البرمجي. الهيكل التفصيلي للجداول مبني على ترميز `snake_case` ومحمي كلياً بالسياسات:

### 3.1 هيكل الجداول الفعلي (Tables Schema)

#### 1. `profiles` (بيانات المستخدمين العامة)

ترتبط بجدول الهوية الأصلي `auth.users` وتخزن البيانات المعروضة:

```sql
id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
full_name       TEXT NOT NULL,
phone           TEXT,
role            TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'driver', 'admin')),
institution_id  UUID REFERENCES institutions(id) ON DELETE SET NULL,
avatar_url      TEXT,
is_verified     BOOLEAN NOT NULL DEFAULT false,
created_at      TIMESTAMPTZ DEFAULT NOW(),
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### 2. `drivers` (بيانات السائقين)

تفاصيل المركبات والتراخيص الخاصة بالسائقين:

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
license_number  TEXT NOT NULL,
vehicle_model   TEXT NOT NULL,
vehicle_plate   TEXT NOT NULL,
capacity        INT NOT NULL DEFAULT 40,
is_verified     BOOLEAN NOT NULL DEFAULT false,
rating          NUMERIC(3,2),
total_trips     INT NOT NULL DEFAULT 0,
balance         NUMERIC(12,2) NOT NULL DEFAULT 0,
created_at      TIMESTAMPTZ DEFAULT NOW(),
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### 3. `routes` (خطوط النقل الجامعي)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
driver_id       UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
title           TEXT NOT NULL,
start_location  TEXT NOT NULL,
end_location    TEXT NOT NULL,
price           NUMERIC(12,2) NOT NULL, -- بالدينار العراقي
capacity        INT NOT NULL,
available_seats INT NOT NULL,
is_active       BOOLEAN NOT NULL DEFAULT true,
start_lat       NUMERIC(10, 6) DEFAULT 33.3128,
start_lng       NUMERIC(10, 6) DEFAULT 44.3615,
end_lat         NUMERIC(10, 6) DEFAULT 33.2800,
end_lng         NUMERIC(10, 6) DEFAULT 44.3800,
departure_time  TEXT,
days_of_week    TEXT[],
created_at      TIMESTAMPTZ DEFAULT NOW(),
updated_at      TIMESTAMPTZ DEFAULT NOW(),
CONSTRAINT routes_available_seats_check CHECK (available_seats >= 0 AND available_seats <= capacity)
```

#### 4. `subscriptions` (اشتراكات الطلاب)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
route_id        UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled', 'expired')),
purchase_price  NUMERIC(12,2) NOT NULL DEFAULT 0, -- السعر المسجل للحظة الشراء (هام لحساب الأرباح)
start_date      TIMESTAMPTZ DEFAULT NOW(),
end_date        TIMESTAMPTZ NOT NULL,
created_at      TIMESTAMPTZ DEFAULT NOW(),
updated_at      TIMESTAMPTZ DEFAULT NOW(),
deleted_at      TIMESTAMPTZ DEFAULT NULL
```

#### 5. `trips` (الرحلات اليومية الفعلية)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
route_id        UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
driver_id       UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
status          TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'driver_waiting', 'in_transit', 'completed', 'absent', 'cancelled')),
scheduled_at    TIMESTAMPTZ NOT NULL,
started_at      TIMESTAMPTZ,
ended_at        TIMESTAMPTZ,
last_lat        NUMERIC(10,7),
last_lng        NUMERIC(10,7),
created_at      TIMESTAMPTZ DEFAULT NOW(),
updated_at      TIMESTAMPTZ DEFAULT NOW(),
deleted_at      TIMESTAMPTZ DEFAULT NULL
```

#### 6. `driver_payouts` (سحوبات أرباح السائقين)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
driver_id       UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
reference_note  TEXT,
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

#### 7. `emergency_reports` (بلاغات الطوارئ SOS)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
reporter_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
trip_id         UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
lat             DOUBLE PRECISION,
lng             DOUBLE PRECISION,
status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### 8. `push_tokens` (رموز أجهزة التنبيه)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
token           TEXT NOT NULL,
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(user_id, token)
```

#### 9. `app_config` (إعدادات النظام والـ Force Update)

```sql
id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
min_version     TEXT NOT NULL DEFAULT '1.0.0',
latest_version  TEXT NOT NULL DEFAULT '1.0.0',
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

---

### 3.2 العلاقات الهيكلية بين الجداول (Entity Relationships)

```
       auth.users ─────────── profiles (1:1)
                                │
          ┌─────────────────────┴─────────────────────┐
          ▼                                           ▼
       drivers (1:1)                               student (profiles)
          │                                           │
          ├──────────────┐                            │
          ▼              ▼                            ▼
       routes (1:M) ── trips (1:M) ◄── [board] ── subscriptions (M:1)
```

---

### 3.3 المرجع الكامل للدوال المخزنة (PostgreSQL RPCs)

1. **`activate_license(p_code TEXT)`**:
   - تفعيل الترخيص بشكل ذري. يقوم بعمل قفل للصف (`FOR UPDATE NOWAIT`) والتحقق من صلاحية الكود والتحقق من معدل الإدخال للوقاية من التخمين، ثم يخصم مقعداً من المسار وينشئ الاشتراك ويسجل العملية في الأوديت لوج.

2. **`cancel_subscription(p_subscription_id UUID)`**:
   - يلغي اشتراك الطالب النشط، ويقوم بقفل البيانات وإرجاع مقعد الحافلة المخصوم للخط لتسهيل حجز طالب آخر، مع التحقق من الهوية والأدوار.

3. **`request_payout(p_amount NUMERIC)`**:
   - يتيح للسائق سحب أرباحه. يقوم بقفل سجل السائق وكل اشتراكاته النشطة والمنتهية لمنع طلبات السحب المزدوجة المتزامنة (Race Conditions).

4. **`update_trip_status(p_trip_id UUID, p_new_status TEXT, p_lat NUMERIC, p_lng NUMERIC, p_driver_id UUID)`**:
   - تحديث الحالة للرحلة مع التحقق من آلة الحالات وضبط أوقات البدء والانتهاء الفعلية.

5. **`bulk_update_trip_locations(p_locations JSONB)`**:
   - دالة تسمح للسائقين بتحديث إحداثيات حافلات متعددة بطلب شبكة واحد، مع إجراء التحقق من نطاق الإحداثيات وقفل الصفوف.

6. **`check_rate_limit(p_user_id UUID, p_action TEXT, p_limit INT, p_window_seconds INT)`**:
   - دالة إدارة حد الطلبات، محسنة لتقليل عمليات الكتابة في قاعدة البيانات (تقرأ أولاً ولا تكتب إلا في حالة القبول للوقاية من استنزاف الـ IOPS).

---

### 3.4 التريجرات التلقائية (Integrity Triggers)

- **`on_subscription_cancel`**: عند تغيير حالة الاشتراك إلى `cancelled` أو `expired` (أو حذفه)، يتم تلقائياً زيادة `available_seats` في جدول `routes` بمقدار 1.
- **`enforce_profile_privileged_fields_trigger`**: يمنع تعديل رتبة المستخدم (`role`) وتوثيقه (`is_verified`) إلا إذا كان المستدعي مسؤولاً (Admin).
- **`on_driver_created`**: عند تعيين سائق جديد، تتم ترقية رتبته تلقائياً في `profiles` وفي `app_metadata` الخاص بالمصادقة للوصول الآمن.
- **`on_driver_deleted`**: عند حذف سجل سائق، يتم خفض الصلاحيات تلقائياً لرتبة طالب لحماية سلامة النظام.

---

### 3.5 الفهارس المحسنة للأداء (Database Indexes)

```sql
-- فهارس العلاقات والتصفية الأكثر تكراراً
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_institution ON profiles(institution_id);
CREATE INDEX idx_subscriptions_route_status ON subscriptions(route_id, status);
CREATE INDEX idx_trips_driver_status ON trips(driver_id, status);

-- فهرس فريد جزئي حاسم يمنع التكرار التزامني للاشتراكات النشطة
CREATE UNIQUE INDEX idx_one_active_sub_per_route
ON subscriptions (student_id, route_id)
WHERE status IN ('active', 'pending');
```

---

### 3.6 المهام المجدولة (pg_cron)

1. **`expire-subscriptions`**:
   - تعمل رأس كل ساعة لمراقبة تاريخ نهاية الاشتراكات وتعديل حالتها تلقائياً من `active` إلى `expired`.
2. **`cleanup-expired-rate-limits`**:
   - تعمل كل 10 دقائق لتنظيف سجلات تحديد معدل الطلبات القديمة (أقدم من ساعة) لتقليل حجم البيانات وتسهيل القراءة السريعة.

---

## 4. آليات الأمان والتحكم بالوصول والتحصين (Security Hardening)

### 4.1 التحقق السريع من الهوية (JWT Claims)

بدلاً من الاستعلام عن قاعدة البيانات للتحقق من دور المستخدم عند كل عملية وصول لصف ما، يعتمد الـ RLS بالكامل على فك ترميز الـ JWT token المستلم من العميل:

```sql
-- zero-reads RLS helper
CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql STABLE;
```

> [!WARNING]
> يمنع استخدام حقل `user_metadata` للتحقق من الأدوار والصلاحيات كونه قابل للتغيير من جهة العميل. يتم الاعتماد كلياً على `app_metadata` المدار من طرف خادمي آمن.

### 4.2 الحماية من هجمات التزامن (Race Conditions)

يتم التفعيل والحجز الذري للمقاعد ومبالغ الأرباح باستخدام Pessimistic Locking عبر تعليمة `FOR UPDATE NOWAIT` أو `FOR UPDATE`. إذا حاول عميلان تعديل نفس السجل في نفس الأجزاء من الثانية، يتم قبول أحدهما فوراً ورفض الآخر بـ Rollback للعملية لحماية الموارد المالية ومقاعد الحافلات.

### 4.3 تحصين سياسات RLS لـ `notification_log` و `emergency_reports`

لمنع إدخال إشعارات كاذبة أو بلاغات SOS للرحلات التي لا يشارك فيها المستخدم:

- سياسة الإدخال للإشعارات تقيد الإضافة فقط للـ `service_role` (الخلفي) أو للمستخدم نفسه لنفسه.
- سياسة إدراج البلاغات الطارئة تقيد الإضافة بشرط أن يكون الطالب مشتركاً بشكل نشط بالخط التابع للرحلة، أو أن يكون السائق المعين للرحلة.

---

## 5. الوظائف الحدية (Edge Functions)

### 5.1 وظيفة محرك الرحلات `trip-engine`

البوابة الرسمية لتلقي تحديثات السائقين للرحلات.

- **المسار**: `/functions/v1/trip-engine`
- **آلية الأمان**: يتحقق من رمز JWT، يطبق معدل طلبات 30/60s، ويتأكد من ملكية السائق للرحلة.
- **إرسال التنبيهات**: يستدعي Expo SDK لإرسال الإشعارات الفورية لجميع هواتف الطلاب المشتركين بالخط لتنبيههم فور تحرك الحافلة أو اقترابها.

### 5.2 وظيفة إرسال الإشعارات `send-notification`

- **المسار**: `/functions/v1/send-notification`
- **المخول**: الأدمن فقط للبث العام، والسائق للخطوط الخاصة به.

### 5.3 بوابات دفع زين كاش (ZainCash Webhook/Checkout)

- **المسار**: `/functions/v1/zaincash-*`
- **الحالة**: **مغلقة ومعطلة مؤقتاً** (ترجع الخطأ `501 Not Implemented` أو `503 Service Unavailable`) لحين توفير التواقيع الرسمية والمصادقة للإنتاج.

---

## 6. إدارة الحالة وحالة عدم الاتصال (Offline & State Management)

### 6.1 مستودعات Zustand (تطبيق الموبايل)

تدار حالة التطبيق محلياً عبر 4 مستودعات رئيسية تدعم الحفظ التلقائي المستمر (`persist` middleware):

- **authStore**: معلومات البروفايل والدور اللحظي.
- **tripStore**: تفاصيل الرحلة الحالية وتاريخ الرحلات النشطة.
- **bookingStore**: مفاتيح التزامن وإجراءات التفعيل المعلقة.
- **i18nStore**: اللغة الحالية للمستخدم (عربي/إنجليزي) وتطبيق الاتجاهات.

### 6.2 قائمة انتظار مواقع GPS الاحتياطية (Offline GPS Queue)

في حال انقطاع تغطية الإنترنت أثناء سير الحافلة، يقوم تطبيق الموبايل بحفظ إحداثيات GPS دورياً في طابور محلي (`AsyncStorage` queue). فور استعادة الاتصال بالشبكة (التحقق عبر RPC `ping` المخصص)، يقوم التطبيق بتفريغ الطابور دفعة واحدة باستدعاء RPC `bulk_update_trip_locations` لضمان عدم ضياع التتبع الجغرافي.

---

## 7. خطوط الأنابيب والأتمتة (CI/CD Workflows)

يتم حماية فرع `main` بالاعتماد على 6 مسارات عمل مؤتمتة في GitHub Actions:

```
[PR Opened] ──► [pr-check.yml] (يفحص .env وتسمية Migrations)
                 │
                 ▼
[Push / Merge] ──► [ci.yml] (Typecheck & Unit Tests Coverage >80%) ──► [deploy.yml] (Migrations & Edge Functions)
```

---

## 8. دليل العمليات والمسار التقني للمطورين (Operations Guide)

### 8.1 خطوات إضافة تعديل برمجي (Workflow)

1. أنشئ فرع جديد من الفرع الرئيسي: `git checkout -b feature/your-feature-name`
2. نفذ التغييرات المطلوبة في الكود مع الالتزام التام بالـ `snake_case` والأنواع الصارمة (لا تستخدم `any`).
3. اختبر الكود وتأكد من نجاح التنسيق محلياً:
   ```bash
   pnpm format
   pnpm typecheck
   pnpm test
   ```
4. ارفع الفرع وافتح Pull Request بمسار مسمى بوضوح. ستقوم خطوط الأنابيب بالفحص التلقائي للكود قبل الدمج.

### 8.2 إضافة تعديل على قاعدة البيانات (SQL Migrations)

1. قم بإنشاء ملف هجرة جديد في `supabase/migrations/` بالنمط الزمني المطلوب.
2. اكتب جمل الاستعلام وتأكد من تطبيق `SET search_path = public` على كافة دوال الـ `SECURITY DEFINER`.
3. اختبر الهجرة محلياً بتنفيذ: `supabase db reset`.

---

## 9. هيكل المشروع والملفات الحرجة ومتغيرات البيئة

### 9.1 الملفات الهندسية الحرجة

- `packages/core/index.ts`: مستودع مخططات التحقق للـ APIs والنواة المشتركة.
- `apps/admin/src/providers/authProvider.ts`: مزود التحقق والدور لمدخل لوحة الإدارة.
- `apps/mobile/src/lib/supabase.ts`: محرك الإعداد للـ Client وتهيئته للاتصال ببيئة الموبايل.
- `apps/mobile/app/_layout.tsx`: حارس التوجيه والتحقق من الهيدريشن للـ Stores وتفعيل الإشعارات والتتبع.

### 9.2 متغيرات البيئة الأساسية (Environment Variables)

- **لوحة التحكم (`apps/admin/.env.local`)**:
  - `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: مفتاح الوصول العام.
  - `DATABASE_URL`: رابط الاتصال المباشر بقاعدة البيانات.

- **تطبيق الهاتف (`apps/mobile/.env`)**:
  - `EXPO_PUBLIC_SUPABASE_URL`: رابط مشروع Supabase.
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: مفتاح الوصول العام للموبايل.

- **خوادم الفانكشنز (Supabase Edge Secrets)**:
  - `SUPABASE_URL`: الرابط الداخلي للمشروع.
  - `SUPABASE_SERVICE_ROLE_KEY`: مفتاح النظام لتجاوز قيود الـ RLS للمهام الإدارية الموثوقة.
  - `ADMIN_URL`: الرابط الأساسي للوحة التحكم المعتمد في الـ CORS.

---

**آخر تحديث ودقة للبيانات**: 2026-05-27
**المهندسون المسؤولون**: فريق عمل Sair الذكي للجامعات
