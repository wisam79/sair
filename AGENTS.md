# دليل إرشادات المطورين للذكاء الاصطناعي — sair v2 (Agent Instructions)

> يمثل هذا الملف المرجع النهائي وهيكل التشغيل البرمجي لأي AI agent يعمل على هذا المشروع. **اقرأه واستوعبه بالكامل قبل إجراء أي تعديل.**

---

## 1. نظرة عامة على المشروع (Project Overview)

### 1.1 ما هو Sair؟

Sair هو **منصة نقل ذكي متكاملة مخصصة لطلاب الجامعات في العراق**. يهدف المشروع إلى ربط الطلاب بسائقي حافلات النقل الجامعي عبر نظام اشتراكات مسبق الدفع (تفعيل أكواد تراخيص بدلاً من الحجز الفردي المباشر للرحلات)، مع توفير تتبع حي لحركة الحافلات عبر موقع GPS والاتصالات الفورية.

```
┌─────────────────────────────────────────────────────────────┐
│                        Sair Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Student (طالب)                  Driver (سائق)             │
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

### 1.2 هيكل المشروع (Symmetric Monorepo Structure)

المشروع مبني بهيكل monorepo متماثل باستخدام `pnpm workspaces` لفصل منطق العمل (Domain Logic) عن طبقة العرض (UI Presentation):

```
sair/
├── apps/
│   ├── admin/          # Next.js 16 + App Router + Refine + MUI (لوحة التحكم للمسؤولين)
│   └── mobile/         # Expo 54 + React Native (تطبيق الطلاب والسائقين الموحد)
├── packages/
│   └── core/           # Zod schemas, i18n keys, state machine (المصدر الوحيد للأنواع والتحقق)
├── supabase/
│   ├── migrations/     # SQL Migrations (المصدر الوحيد لهيكل ومنطق قاعدة البيانات)
│   └── functions/      # Edge Functions (Deno) للمهام الحساسة والربط الخارجي
└── docs/               # التوثيق الهندسي الشامل والمسار التقني
```

> ⚠️ **تنبيه حاسم**: تم حذف مجلد `packages/db` و Drizzle ORM تماماً من المشروع. يتم إجراء كل منطق البيانات والاستعلامات عبر استدعاءات Supabase Client المباشرة و SQL RPCs فقط.

### 1.3 المسؤوليات وتوزيع الأدوار (Architectural Responsibilities)

| الطبقة                   | المسؤول                                           | التقنية المستخدمة                |
| :----------------------- | :------------------------------------------------ | :------------------------------- |
| **Presentation (العرض)** | واجهة المستخدم للـ Mobile والـ Admin              | Next.js (Admin), Expo (Mobile)   |
| **Service (الخدمات)**    | معالجة الطلبات الخارجية، التنبيهات، والتحقق الحدي | Edge Functions (Deno/Typescript) |
| **Data/Logic (المنطق)**  | العمليات المعقدة وقفل الجداول والأمان الصارم      | PostgreSQL RPCs & Triggers       |
| **Core (النواة)**        | أنواع البيانات المشتركة ومخططات التحقق            | Zod Schemas & XState FSM         |

---

## 2. قواعد الأمان الصارمة والتحصين (Security & Hardening Rules) ⚠️

### 2.1 حظر `user_metadata` واعتماد `app_metadata` فقط

- **الخطر**: الحقل `user_metadata` يمكن تعديله من طرف العميل (Client-Writable)، مما يجعله ثغرة أمنية فادحة لتصعيد الصلاحيات (Privilege Escalation).
- **القاعدة**: يتم تحديد وتخزين دور المستخدم (Role) وتوثيقه بشكل آمن داخل `app_metadata` الخاص بـ Supabase Auth والذي لا يكتب إلا من طرف خادمي أو عبر تريجر قاعدة البيانات.

```typescript
// ❌ خطأ فادح!
const role = user.user_metadata?.role;

// ✅ صحيح وآمن!
const role = user.app_metadata?.role;
```

### 2.2 تحصين صلاحيات الدوال الحساسة (Execution Privileges Hardening)

يمنع تماماً ترك الصلاحيات الافتراضية للدوال في PostgreSQL (المتاحة لـ PUBLIC). يجب دائماً سحب صلاحيات التنفيذ العامة عن الدوال الحساسة لمنع استدعائها بشكل مجهول وتقييدها بالـ Role المناسب:

```sql
-- سحب الصلاحيات العامة
REVOKE EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) FROM PUBLIC;
-- منحها فقط للموثقين والـ service_role
GRANT EXECUTE ON FUNCTION public.admin_cancel_trip(uuid) TO authenticated, service_role;
```

- **دوال التريجرات (Trigger Functions)** لا يجوز إتاحتها للـ RPC إطلاقاً. يجب سحب صلاحيات التنفيذ منها بالكامل:

```sql
REVOKE EXECUTE ON FUNCTION public.sync_driver_role_promotion() FROM PUBLIC, anon, authenticated;
```

### 2.3 سياق بحث آمن (Secure Search Path)

لمنع هجمات حقن مسارات الاستدعاء المتغيرة (Mutable Search Path Vulnerability)، يجب كتابة `SET search_path = public` صراحةً عند تعريف أو تعديل أي دالة `SECURITY DEFINER`:

```sql
CREATE OR REPLACE FUNCTION get_my_role() RETURNS text AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'student'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
```

### 2.4 حظر كائنات العرض غير الآمنة (No Security Definer Views)

يمنع إنشاء Views بخصائص `SECURITY DEFINER` داخل المخطط `public` لأنها تنكشف تلقائياً لواجهة البرمجة (PostgREST API) وتُسرب بيانات حساسة دون التحقق من الـ RLS الخاص بالجداول الأساسية.

### 2.5 حظر سياسات RLS المفتوحة (No Blanket Write Policies)

يمنع استخدام سياسات إدخال أو تعديل مفتوحة دائماً مثل `WITH CHECK (true)` للجداول الحساسة. يجب تقييد الإدخال للأدوار المحددة (مثل `TO service_role` لجدول `notification_log` أو وضع شروط تحقق حقيقية).

---

## 3. قاعدة البيانات ومخطط الهجرة (Database & Migrations)

### 3.1 Migrations هي مصدر الحقيقة الوحيد

- لا توجد أي تعديلات يدوية على قاعدة البيانات في بيئة الإنتاج.
- يتم إدارة وتتبع كافة هياكل الجداول، السياسات، الدوال، والفهارس عبر ملفات هجرة SQL داخل مجلد `supabase/migrations/`.
- يتم تطبيق الهجرة للإنتاج عبر الأمر: `supabase db push`.

### 3.2 نمط تسمية ملفات الهجرة

تتبع التسمية الهيكل الصارم التالي لمنع التداخل وحفظ الترتيب الزمني:
`YYYYMMDDNNNNNN_description.sql` (حيث YYYY=السنة، MM=الشهر، DD=اليوم، NNNNNN=الرقم المتسلسل للعملية).
مثال: `20260524000001_ultimate_fix.sql`

---

## 4. الجداول الأساسية وبنيتها (Core Tables Schema)

تتألف قاعدة البيانات من الجداول الموثقة والنشطة التالية:

| الجدول              | الوصف                                                 | تفعيل RLS | خصائص برمجية فريدة                                                                                |
| :------------------ | :---------------------------------------------------- | :-------: | :------------------------------------------------------------------------------------------------ |
| `profiles`          | البيانات العامة للمستخدمين (الطلاب، السائقين، الأدمن) |    ✅     | مرتبط بـ `auth.users` عبر علاقة 1:1، يحتوي على تريجر لمزامنة التغييرات ومنع تعديل الحقول الحساسة. |
| `drivers`           | بيانات السائقين وتوثيقهم وسعة مركباتهم                |    ✅     | مفتاح فرعي فريد `user_id` يشير إلى `profiles.id`                                                  |
| `routes`            | خطوط النقل الجامعي والأسعار والمقاعد الشاغرة          |    ✅     | قيد تحقق: `available_seats >= 0 AND available_seats <= capacity`                                  |
| `subscriptions`     | اشتراكات الطلاب النشطة والملغاة على الخطوط            |    ✅     | فهرس فريد جزئي لمنع تكرار الاشتراكات النشطة للطالب الواحد على نفس المسار.                         |
| `trips`             | الرحلات اليومية الفعلية وحالة تتبعها الجغرافي         |    ✅     | تتبع حالة الرحلة وتحديث موقع GPS.                                                                 |
| `driver_payouts`    | طلبات سحب الأرباح التابعة للسائقين وحالتها            |    ✅     | الحالات: `pending`, `completed`, `rejected`. مع قفل تزامني عند تقديم الطلب.                       |
| `audit_logs`        | سجل تدقيق العمليات الحساسة للأمان والتحليل            |    ✅     | الحقل `details` بنوع `JSONB` لتخزين حمولة العمليات.                                               |
| `ratings`           | تقييم الطلاب للرحلات والسائقين (من 1 إلى 5)           |    ✅     | علاقة فريدة ثنائية: قيد `UNIQUE(trip_id, student_id)` لمنع التقييم المتكرر.                       |
| `conversations`     | المحادثات الفورية بين الطالب والسائق لكل خط           |    ✅     | حقول الربط للمشاركين والخط.                                                                       |
| `messages`          | الرسائل المرسلة داخل المحادثات                        |    ✅     | حقل تحديد القراءة `is_read`.                                                                      |
| `notification_log`  | سجل الإشعارات الصادرة لكل مستخدم                      |    ✅     | الحقل `data` بنوع `JSONB`.                                                                        |
| `app_config`        | إعدادات التطبيق وتحديثات الإصدار الإجباري             |    ✅     | صف واحد فقط `id = 1` للتحكم بنظام Force Update.                                                   |
| `emergency_reports` | بلاغات الطوارئ النشطة (زر SOS) للمشاركين في الرحلة    |    ✅     | تتبع جغرافي للحافلة لحظة التبليغ.                                                                 |
| `push_tokens`       | رموز التنبيهات لأجهزة الهواتف الذكية                  |    ✅     | قيد فريد `UNIQUE(user_id, token)`.                                                                |
| `support_requests`  | طلبات الدعم والمساعدة الفنية للتطبيق                  |    ✅     | الحالات: `open`, `in_progress`, `closed`.                                                         |
| `rate_limits`       | سجل معدل الطلبات للحد من brute-force والـ DDoS        |    ✅     | حظر الوصول المباشر للجدول وقراءته حصراً عبر RPC.                                                  |

---

## 5. نظام التراخيص والاشتراكات الذري (Atomic License & Seats Flow) 🎫

تعتمد المنصة على نظام تفعيل مسبق الدفع للخطوط الجامعية لضمان التزامن المالي والتشغيلي:

### 5.1 آلية التفعيل (Activation Workflow)

```
Admin (أدمن)                              Student (طالب)
  │                                           │
  │  create_license_batch()                   │
  │  ├─ quantity: 100                         │
  │  ├─ route_id: XXX                         │
  │  └─ codes: [A1B2C3D4, ...] (8 chars)       │
  │                                           │
  │                                activate_license("A1B2C3D4")
  │                                           │
  │  1. Check rate limit (5 attempts / 15m)   │
  │  2. Lock license row (FOR UPDATE NOWAIT)  │
  │  3. Verify status = 'active'              │
  │  4. Deduct route.available_seats (-1)     │
  │  5. Mark license as 'used' (used_by, used_at)
  │  6. Insert active subscription (30 days)  │
  │  7. Write Audit Log                       │
```

### 5.2 التحقق من تكرار الاشتراك التزامني (Race Condition Prevention)

لمنع السيناريو الذي يقوم فيه الطالب بإرسال طلبي تفعيل متزامنين للترخيص مما قد يتسبب في إنشاء اشتراكين مكررين، تم تثبيت فهرس فريد جزئي على قاعدة البيانات:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_sub_per_route
ON subscriptions (student_id, route_id)
WHERE status IN ('active', 'pending');
```

أي طلب إدخال متزامن ثانٍ سيفشل تلقائياً على مستوى محرك PostgreSQL بـ `unique_violation` ويقوم بعمل rollback فوري للعملية بالكامل.

### 5.3 المقاعد تتبع الاشتراك وليس الرحلة

- يتم حجز المقعد عند تفعيل الترخيص (خصم المقعد من المسار `routes`).
- لا يتم حجز المقاعد عند إنشاء الرحلات اليومية. الطالب المشترك يمكنه ركوب أي رحلة تابعة للخط الذي اشترك فيه.
- عند إلغاء الاشتراك (`cancel_subscription` أو انتهاء صلاحيته عبر `pg_cron`)، يتم إعادة المقعد للمسار:

```sql
UPDATE routes SET available_seats = LEAST(capacity, available_seats + 1) WHERE id = v_route_id;
```

---

## 6. محرك الحالات للرحلات (Trip State Machine)

تتحرك الرحلة اليومية وفق آلة حالة صارمة معرفة في النواة `@sair/core` ويتم حمايتها عبر SQL RPC:

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

### 6.1 قواعد الانتقالات (State Transition Rules)

- **الانتقالات المسموحة**:
  - `scheduled` ← `driver_waiting` (يصل السائق لنقطة الانطلاق)، `absent` (لم يظهر السائق)، `cancelled` (إلغاء مسبق).
  - `driver_waiting` ← `in_transit` (بدء سير الرحلة)، `absent`، `cancelled`.
  - `in_transit` ← `completed` (الوصول للوجهة)، `cancelled` (إلغاء طارئ للرحلة أثناء السير).
  - `absent` ← `cancelled`.
- **ملاحظات هامة**:
  - الانتقال المباشر من `in_transit` إلى `absent` **ممنوع تماماً**.
  - إلغاء الرحلة مسموح للمسؤولين والسائقين فقط وتعتبر الحالات `completed` و `cancelled` حالات نهائية لا يمكن الخروج منها.

---

## 7. قائمة الدوال المخزنة والـ RPCs الرئيسية (Database RPCs Reference)

| اسم الدالة (RPC)               | المدخلات (Parameters)                                         | الدور المخول بالاستدعاء  | الوصف والوظيفة                                                                            |
| :----------------------------- | :------------------------------------------------------------ | :----------------------- | :---------------------------------------------------------------------------------------- |
| `get_my_role()`                | لا يوجد                                                       | `authenticated`          | ترجع دور المستخدم الحالي مباشرة من JWT `app_metadata`.                                    |
| `is_admin()`                   | لا يوجد                                                       | `authenticated`          | ترجع True إذا كان دور المستخدم مسؤولاً.                                                   |
| `activate_license()`           | `p_code TEXT`                                                 | `student`                | تفعيل كود ترخيص بطول 8 أحرف بشكل ذري ومعالجة قفل الصف والمقاعد.                           |
| `create_license_batch()`       | `p_route_id, p_batch_name, p_quantity, p_price, p_valid_days` | `admin`                  | إنشاء دفعة تراخيص جديدة وتوليد أكواد قوية بطول 8 أحرف.                                    |
| `create_trip()`                | `p_route_id, p_scheduled_at`                                  | `driver` (الموثق)        | إنشاء رحلة جديدة وجدولتها للخط المخصص للسائق.                                             |
| `admin_cancel_trip()`          | `p_trip_id UUID`                                              | `admin`                  | إلغاء رحلة مجدولة أو نشطة مع توثيق ذلك في سجل المراجعة.                                   |
| `cancel_subscription()`        | `p_subscription_id UUID`                                      | `student` / `admin`      | إلغاء اشتراك نشط للطالب وإرجاع المقعد الشاغر للمسار فوراً بشكل ذري.                       |
| `update_trip_status()`         | `p_trip_id, p_new_status, p_lat, p_lng, p_driver_id`          | استدعاء داخلي (خلفي)     | التحقق وتطبيق انتقال الحالة للرحلة مع حفظ الإحداثيات الجغرافية.                           |
| `update_trip_location()`       | `p_trip_id, p_lat, p_lng`                                     | `driver`                 | تحديث موقع الحافلة الجغرافي للرحلة النشطة دون تغيير الحالة.                               |
| `bulk_update_trip_locations()` | `p_locations JSONB`                                           | `driver`                 | تحديث جماعي للمواقع للحد من طلبات الشبكة، مدعوم بقفل الصف والتحقق الإحداثي ومعدل الطلبات. |
| `request_payout()`             | `p_amount NUMERIC`                                            | `driver`                 | طلب سحب الأرباح. يقوم بقفل الحساب وحساب الأرباح الفعلية ناقص المسحوبات السابقة.           |
| `update_payout_status()`       | `p_payout_id, p_new_status`                                   | `admin`                  | تحديث حالة طلب الصرف للقبول أو الرفض وتعديل الأرصدة.                                      |
| `get_unread_count()`           | لا يوجد                                                       | `authenticated`          | جلب عدد الرسائل غير المقروءة للمستخدم الحالي في محادثاته النشطة.                          |
| `mark_messages_read()`         | `p_conversation_id UUID`                                      | `authenticated`          | تعليم رسائل المحادثة كمقروءة للمشارك (الطرف المستلم).                                     |
| `register_push_token()`        | `p_token TEXT`                                                | `authenticated`          | تسجيل رمز تنبيه الهاتف الذكي للمستخدم مع تجنب التكرار.                                    |
| `get_app_config()`             | لا يوجد                                                       | `anon` / `authenticated` | جلب رقم إصدار التطبيق الأدنى والأنسب لإجبار المستخدمين على التحديث.                       |
| `get_dashboard_stats()`        | لا يوجد                                                       | `authenticated` (Admin)  | جلب الإحصائيات والأرقام والتقارير المالية للوحة تحكم المسؤولين.                           |
| `check_rate_limit()`           | `p_user_id, p_action, p_limit, p_window_seconds`              | `service_role` فقط       | فحص معدل الطلبات للمستحدم، مطبق بقراءة محسنة وقفل كتابة مجدول.                            |
| `ping()`                       | لا يوجد                                                       | `authenticated`          | دالة لفحص استقرار الاتصال بشبكة قاعدة البيانات وتجاوز قيود الـ RLS.                       |

---

## 8. الـ Triggers الفعالة في قاعدة البيانات

قاعدة البيانات مبنية بآلية تضمن تناسق البيانات التلقائي (Database Integrity Triggers) وتوثيق التغييرات:

1. **`set_trips_updated_at` (جدول `trips`)**: تحديث حقل `updated_at` تلقائياً عند أي تعديل.
2. **`update_payments_updated_at` (جدول `payments`)**: تحديث حقل `updated_at` تلقائياً.
3. **`update_conversations_updated_at` (جدول `conversations`)**: تحديث حقل `updated_at` تلقائياً.
4. **`on_driver_created` (جدول `drivers`)**: عند إضافة سجل سائق جديد، يتم ترقية دوره تلقائياً في جدول `profiles` وفي `app_metadata` الخاص بـ Supabase Auth إلى `driver`.
5. **`on_driver_deleted` (جدول `drivers`)**: عند حذف سائق، يتم تخفيض دوره تلقائياً إلى `student` لحماية صلاحيات النظام.
6. **`enforce_profile_privileged_fields_trigger` (جدول `profiles`)**: يمنع الطلاب والسائقين من تعديل الحقول الحساسة (مثل `role` أو `is_verified`) وتسمح للأدمن فقط بتعديلها.
7. **`on_profile_role_changed` (جدول `profiles`)**: يراقب أي تعديل على الدور في جدول البروفايل ويقوم بمزامنته فوراً إلى `app_metadata` الخاص بالمستخدم لمنع تعارض الصلاحيات.

---

## 9. الوظائف الحدية (Edge Functions Reference)

تدار الوظائف الحدية عبر خوادم Deno وتعمل كبوابات تحقق وتواصل خارجية:

### 9.1 محرك الرحلات `trip-engine`

- **المسار**: `/functions/v1/trip-engine`
- **المدخلات**: `TripUpdateRequest` (مخطط Zod) يحتوي على `trip_id`, `new_status`, والإحداثيات الجغرافية.
- **الخطوات البرمجية**:
  1. التحقق من الهوية وصلاحية الـ JWT token.
  2. فحص معدل الطلبات (حد: 30 طلب بالدقيقة).
  3. التحقق من أن السائق هو المعين الفعلي للرحلة.
  4. استيراد آلة الحالات من النواة وتأكيد صحة الانتقال.
  5. استدعاء RPC `update_trip_status` لتعديل الحالة في قاعدة البيانات.
  6. سحب رموز التنبيهات وإرسال إشعارات فورية عبر **Expo Push SDK** للطلاب المشتركين بالخط.
  7. تدوين الحدث بسجل المراجعة والتدقيق `audit_logs`.

### 9.2 إرسال الإشعارات `send-notification`

- **المسار**: `/functions/v1/send-notification`
- **المدخلات**: `NotificationRequest` (مخطط Zod) لتحديد الشخص المستهدف أو الدور المستهدف (`all`, `student`, `driver`) مع العنوان والحمولة.
- **الأمان**: متاح للأدمن والسائقين فقط (مع حظر السائقين من البث العام).
- **الآلية**: فحص معدل الطلبات وإرسال الإشعارات الفورية بالاعتماد على Expo SDK مع دعم إعادة المحاولة التلقائية في حال فشل الخوادم (`retryWithBackoff`).

### 9.3 مسجل أخطاء العميل `log-error`

- **المسار**: `/functions/v1/log-error`
- **الأمان**: `verify_jwt = false` متعمد للسماح بتسجيل الأخطاء حتى لو فشل الاتصال بالهوية. يقوم بالطباعة المباشرة للأخطاء لتسجيلها في خوادم المراقبة.

---

## 10. تطبيق الموبايل (Expo Application Conventions)

عند كتابة أو تعديل أي منطق في تطبيق الموبايل (`apps/mobile/`):

### 10.1 مزامنة وحالة مستودع Zustand (Zustand Hydration Guard)

لحماية التطبيق من أخطاء عدم تطابق الواجهات وتوجيه المسارات قبل قراءة البيانات المخزنة محلياً، يجب التحقق من اكتمال الـ Hydration للمستودعات المستمرة (Persisted Stores) قبل عرض أي واجهة أو اتخاذ قرار توجيه:

```typescript
const [hydrated, setHydrated] = useState(false);
useEffect(() => {
  const hydrate = async () => {
    await persistedStore.persist;
    setHydrated(true);
  };
  hydrate();
}, []);

if (!hydrated) return <LoadingSkeleton />;
```

### 10.2 تجنب تكرار التقييم والأداء (Inline Functions Avoidance)

لضمان ثبات معدل الفريمات (FPS) ومنع إعادة بناء العناصر داخل القوائم الكبيرة (FlatList/SectionList)، يحظر تمرير الدوال المباشرة كخصائص ويجب تغليفها بـ `useCallback`:

```tsx
// ❌ خطأ يضر بالأداء
renderItem={({ item }) => <RouteCard item={item} onPress={() => handleSelect(item.id)} />}

// ✅ أداء ممتاز وثابت
const renderItem = useCallback(({ item }) => (
  <RouteCard item={item} onPress={handleSelect} />
), [handleSelect]);
```

### 10.3 الترجمة والاتجاهات (i18n & RTL)

- يحظر تماماً وضع نصوص صلبة (Hardcoded strings) في واجهات العرض.
- يتم استخدام مفاتيح الترجمة من النواة وتفعيلها عبر Hook `useTranslation`.
- دعم كامل للاتجاهات من اليمين لليسار (RTL) للغة العربية.

---

## 11. لوحة تحكم المسؤولين (Admin Next.js Conventions)

- مبنية باستخدام **Refine** و **Material UI** لسرعة التطوير وإدارة موارد الجداول.
- تفعيل CSP صارم للوقاية من ثغرات XSS.
- يعتمد الـ Middleware على `supabase.auth.getUser()` للتحقق الفعلي لمنع التزييف عبر الكوكيز.
- حظر تام لاستخدام `SERVICE_ROLE_KEY` في الواجهات أو كود العميل.

---

## 12. متطلبات واختبارات التطوير والجودة (Testing & CI/CD)

### 12.1 متطلبات الفحص قبل الـ Commit

- تشغيل التنسيق التلقائي: `pnpm format`
- التحقق من الأنواع الصارم: `pnpm typecheck` (يُحظر استخدام `any` نهائياً في كامل التطبيق).
- تشغيل اختبارات الوحدة: `pnpm test` (نسبة تغطية الاختبارات المطلوبة للملفات الأساسية >= 80% للأسطر و 70% للفروع).

### 12.2 اختبارات القبول والواجهات (Playwright E2E)

- يتم التحقق من أمان السياسات وسلامة قاعدة البيانات ومحرك الحالات عبر 13 اختبار E2E شامل في ملف `tests/` ويتم تشغيلها تلقائياً في GitHub Actions للتأكد من عدم وجود تراجعات (Regressions).

### 12.3 بيئات عمل Supabase الموثقة

| البيئة                            | معرف المشروع (Project Ref) | ملف الإعداد المربوط / رابط URL |
| :-------------------------------- | :------------------------- | :----------------------------- |
| **محاكي محلي (Local Emulator)**   | لا يوجد (Local Localhost)  | `http://localhost:54321` (يتطلب Docker) |
| **الاختبار والتطوير (Staging/Test)**| `cxyggxsyiymgxvwzeatv`     | `https://cxyggxsyiymgxvwzeatv.supabase.co` |
| **الإنتاج والتشغيل (Production)** | `zpcvvyxtmxzplmojobbv`     | `https://zpcvvyxtmxzplmojobbv.supabase.co` |

> ℹ️ **ملاحظة هامة للتطوير والاختبار**: نظراً لعدم توفر بيئة Docker محلياً، يتم الاعتماد على بيئة الاختبار السحابية المخصصة (Staging/Test Project: `cxyggxsyiymgxvwzeatv`) لإجراء اختبارات التطوير والتحقق كبديل للمحاكي المحلي.

---

**آخر تحديث ودقة للمعلومات**: 2026-05-27
**الحالة الفنية للمشروع**: جاهز للإنتاج ومحصن بالكامل 🚀
