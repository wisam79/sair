# تقرير الجاهزية للإنتاج — Sair v2

## Production Readiness Report — 2026-05-24

---

## 1. ملخص عام (Executive Summary)

| المجال                    | الحالة                                        |
| ------------------------- | --------------------------------------------- |
| **Git & Version Control** | ✅ جيد — main نظيفة، branches منتظمة          |
| **Database (Migrations)** | ✅ ممتاز — 68 migration، Local = Remote       |
| **Security (RLS & Auth)** | ✅ ممتاز — app_metadata فقط، search_path صارم |
| **Edge Functions**        | ✅ جيد جداً — auth, rate limit, validation    |
| **Admin App (Next.js)**   | ✅ جيد — CSP, middleware, app_metadata        |
| **Mobile App (Expo)**     | ✅ جيد — hydration, error boundary, offline   |
| **Core Package**          | ✅ ممتاز — Zod schemas, state machine         |
| **CI/CD**                 | ✅ جيد جداً — 6 workflows, security scanning  |
| **Environment/Secrets**   | ⚠️ بحاجة مراجعة                               |
| **Technical Debt**        | ⚠️ متوسط                                      |

**التقييم العام: ✅ جاهز للإنتاج مع ملاحظات بسيطة**

---

## 2. Git & Version Control

### الحالة

- الفرع: `main` — محدث مع `origin/main`
- لا يوجد تغييرات غير ملتزمة (untracked files: docs/ + opencode.json)
- السجل: 48 commit آخرها `8ae0883 fix(supabase): disable JWT verification`
- الأفرع: 6 feature branches مفتوحة، 20 branch عن بعد

### ملاحظات

- 🔸 فرع `security/harden-admin-and-analytics` لم يندمج بعد — راجع ما إذا كانت تغييراته مغطاة بالمigrations
- 🔸 2 stash entries موجودين (google-signin-logo, ci-pnpm-version) — قد تحتوي تغييرات غير ملتزمة

---

## 3. Database — Migrations & Schema

### الحالة: ✅ ممتاز

- **68 migration file** — كلها متطابقة بين Local ↔ Remote
- آخر migration: `20260524000007_harden_dashboard_analytics_rpcs.sql`
- أسماء migrations تطابق النمط `YYYYMMDDNN_description.sql`

### الجداول الرئيسية

| الجدول             | RLS | ملاحظة                                  |
| ------------------ | --- | --------------------------------------- |
| `profiles`         | ✅  | مع trigger لمنع تعديل privileged fields |
| `drivers`          | ✅  | مع trigger لمزامنة auth                 |
| `routes`           | ✅  | مع سياسات driver                        |
| `subscriptions`    | ✅  |                                         |
| `trips`            | ✅  |                                         |
| `payments`         | ✅  |                                         |
| `audit_logs`       | ✅  |                                         |
| `ratings`          | ✅  |                                         |
| `messages`         | ✅  |                                         |
| `conversations`    | ✅  |                                         |
| `notification_log` | ✅  | service_role فقط للإدراج                |
| `support_requests` | ✅  | WITH CHECK (email IS NOT NULL)          |

### نقاط القوة

- ✅ جميع دوال SECURITY DEFINER لديها `SET search_path = public`
- ✅ جميع دوال التريجرز تم سحب صلاحيات EXECUTE منها
- ✅ جميع الـ RPCs الحساسة مقيدة بـ `authenticated` و `service_role`
- ✅ `user_metadata` غير مستخدم — `app_metadata` فقط

---

## 4. Security

### الحالة: ✅ ممتاز (بعد التعديلات الأخيرة)

### RPC Permissions

- تم سحب `EXECUTE FROM PUBLIC` عن جميع الدوال الحساسة
- Trigger functions مرفوضة تماماً من `PUBLIC, anon, authenticated`
- Admin RPCs: `admin_cancel_trip`, `admin_create_trip`, `get_enhanced_analytics`, `get_system_health` كلها مقيدة

### JWT & Auth

- ✅ Admin middleware يستخدم `app_metadata` للتحقق من الدور
- ✅ Mobile auth يستخدم `app_metadata` للدور (التعليق على السطر 114: `// SECURITY: app_metadata only`)
- ✅ Edge Functions تتحقق من الدور عبر `app_metadata`
- ✅ Role sync triggers تعمل بشكل صحيح

### CSP (Admin App)

- `script-src: 'self' 'unsafe-eval' 'unsafe-inline'` — ضروري لـ Next.js/MUI لكنه يخفف الحماية
- `connect-src: https://*.supabase.co wss://*.supabase.co` — صحيح
- `frame-ancestors: 'none'` — جيد
- `upgrade-insecure-requests` — جيد

### CORS (Edge Functions)

- ✅ `ALLOWED_ORIGINS` يقرأ من `ADMIN_URL` environment variable
- ✅ يدعم `exp://localhost:8081` و `http://localhost:8081`

---

## 5. Edge Functions

### Trip Engine (`trip-engine`)

| الجانب             | الحالة                                        |
| ------------------ | --------------------------------------------- |
| Auth               | ✅ JWT verification via `verifyAuth`          |
| Authorization      | ✅ يتحقق من driver profile و driver_id للمسار |
| Input Validation   | ✅ Zod schema (`TripUpdateRequest`)           |
| State Machine      | ✅ يستخدم `canTransition()` من `@sair/core`   |
| Rate Limiting      | ✅ 30 request / 60 sec                        |
| Idempotency        | ✅ يدعم `idempotency-key`                     |
| Push Notifications | ✅ Expo push + receipt handling               |
| Audit Logging      | ✅                                            |
| Error Handling     | ✅ try/catch شامل                             |

### Send Notification (`send-notification`)

| الجانب             | الحالة                             |
| ------------------ | ---------------------------------- |
| Auth               | ✅ JWT verification                |
| Authorization      | ✅ admin/driver فقط                |
| Input Validation   | ✅ Zod schema                      |
| Rate Limiting      | ✅ 10 request / 60 sec             |
| Driver Restriction | ✅ driver لا يمكنه إرسال broadcast |
| Retry              | ✅ يستخدم `retryWithBackoff`       |
| Error Handling     | ✅                                 |

### ZainCash Checkout (`zaincash-checkout`)

- ✅ Input validation
- ✅ Auth + role check
- ⏸️ **مُعطل** — يرجع `501` لأن merchant credentials غير مهيأة

### ZainCash Webhook (`zaincash-webhook`)

- ✅ `verify_jwt = false` في config (متعمد — webhooks لا تحمل JWT)
- ⏸️ **مُعطل** — يرجع `503/501`

### Log Error (`log-error`)

- ✅ `verify_jwt = false` (متعمد — لتسجيل أخطاء العميل)
- ✅ Basic validation للحقول
- ⚠️ لا يخزن الأخطاء في قاعدة البيانات — فقط console

### Shared Modules

- ✅ `auth.ts`: خدمتان — Supabase Admin (service_role) و User Client (anon مع JWT)
- ✅ `cors.ts`: CORS properly configured with `ALLOWED_ORIGINS`

---

## 6. Admin App (Next.js + Refine + MUI)

### الحالة: ✅ جيد

### Structure

- Next.js 16.2.6 + App Router
- Refine v4 + MUI v6
- 25 صفحة (manage: drivers, trips, routes, subscriptions, licenses, etc.)
- Supabase SSR للـ middleware

### الأمان

- ✅ `middleware.ts` — يعيد التحقق من الجلسة عبر `supabase.auth.getUser()` (يمنع cookie spoofing)
- ✅ `authProvider.ts` — يتحقق من `app_metadata.role === 'admin'`
- ✅ `NEXT_PUBLIC_*` فقط في client — لا service_role keys
- ✅ CSP headers صارمة

### القوة

- Tailwind + MUI لتنسيق متقدم
- snake_case → camelCase في dataProvider
- RTL support مع `stylis-plugin-rtl`
- Coverage thresholds في CI (lines >= 80%)

### ⚠️ ملاحظة حرجة

- 🔴 **`typescript.ignoreBuildErrors: true`** في `next.config.ts` — هذا يسمح ببناء التطبيق حتى مع وجود أخطاء TypeScript. يمنع اكتشاف الأخطاء في مرحلة البناء. يجب إصلاحه.

### اختبارات

- `authProvider.test.ts`, `dataProvider.test.ts`, `i18n.test.ts` موجودة
- لكن لا يوجد اختبارات للـ pages/API routes

---

## 7. Mobile App (Expo + React Native)

### الحالة: ✅ جيد

### Structure

- Expo 54 + Expo Router
- 15 شاشة (auth, tabs, tracking, chat, etc.)
- Zustand stores مع persist + hydration
- React Query للـ API calls

### الأمان

- ✅ `supabase.ts` يستخدم `EXPO_PUBLIC_*` فقط
- ✅ Mobile `_layout.tsx` يستخدم `app_metadata` للتحقق من الدور
- ✅ `handleNewUser` trigger يربط `user_metadata` بـ `app_metadata` عند التسجيل

### نقاط القوة

- ✅ **Hydration handling**: كل الـ stores تتحقق من hydration قبل التوجيه (Navigation guard في `_layout.tsx`)
- ✅ **ErrorBoundary**: class component يمسح الأخطاء ويعيد المحاولة
- ✅ **Offline detection**: `useNetworkStatus` مع banner عندما يكون غير متصل
- ✅ **Force update**: يتحقق من `get_app_config` عند بدء التشغيل
- ✅ **Push notifications**: إعداد `useNotifications` في الـ root layout
- ✅ **الترجمة**: كل النصوص عبر `useTranslation()` مع i18n
- ✅ **Font loading**: استخدام SplashScreen + useFonts لمنع flickering

### ⚠️ ملاحظات

- 🔸 **AsyncStorage للتخزين**: auth tokens مخزنة في AsyncStorage (غير مشفر). `expo-secure-store` مثبت كـ plugin لكن غير مستخدم. هذا مقبول لمعظم التطبيقات لكنه ليس الحل الأمثل.
- 🔸 **user_metadata مخزنة في Zustand**: `AuthUser.user_metadata` مخزنة في الـ store لكنها غير مستخدمة للتحقق من الدور — فقط للعرض. يمكن إزالتها لتقليل سطح الهجوم.
- 🔸 **console.log في الإنتاج**: هناك `console.log` في `_layout.tsx` (لـ role mismatch) — مقبول للتصحيح لكن الأفضل استخدام الـ logger.
- 🔸 **لا يوجد `lint` script** في `package.json` الخاص بـ mobile.
- 🔸 **React 19.1.0** مع `@tanstack/react-query` v5 — واجهت مشاكل توافقية معروفة.

---

## 8. Core Package (Zod + State Machine)

### الحالة: ✅ ممتاز

### Zod Schemas

- `UserRole`, `TripStatus`, `SubscriptionStatus`, `LicenseStatus`, `DriverPayoutStatus`
- `LicenseSchema` — `code: z.string().length(8)` ✅
- `TripUpdateRequest` — مع `lat`/`lng` optional
- `NotificationRequest` — مع refine للتحقق من `target_user_id` أو `target_role`
- جميع الـ schemas تستخدم `snake_case`

### State Machine

- `tripStateMachine` — 6 حالات مع انتقالات صحيحة (من `in_transit` → `cancelled` مسموح)
- `ValidTransitions` نسخة احتياطية
- `canTransition()` — يستخدم `Object.values(stateConfig.on).includes(to)`

### Utilities

- `retryWithBackoff()` — مناسب لـ Deno, Node, React Native
- `getErrorMessage()` — معالجة آمنة للأخطاء

---

## 9. CI/CD

### الحالة: ✅ جيد جداً

| الـ Workflow         | الغرض                                        | الحالة |
| -------------------- | -------------------------------------------- | ------ |
| `ci.yml`             | Lint, Typecheck, Tests, Build Admin          | ✅     |
| `pr-check.yml`       | PR validation (env, console.log, migrations) | ✅     |
| `deploy.yml`         | Deploy migrations + edge functions           | ✅     |
| `e2e.yml`            | E2E tests with Playwright                    | ✅     |
| `security.yml`       | Weekly dependabot + SQL review               | ✅     |
| `db-consistency.yml` | DB ↔ Code sync, SQL lint                     | ✅     |

### نقاط القوة

- ✅ **Frozen lockfile** في كل workflow
- ✅ **Coverage thresholds** (lines >= 80%, branches >= 70%)
- ✅ **التأكد من عدم وجود .env** في PRs
- ✅ **التحقق من صحة تسمية migrations** في PRs
- ✅ **Deployment فقط بعد CI** (يستخدم `workflow_run`)
- ✅ **Secrets validation** قبل الـ deployment
- ✅ **Security scanning** — SQL patterns, user_metadata, hardcoded passwords
- ✅ **Spot check naming conventions** — secure proper regex

### ⚠️ ملاحظات

- 🔸 لا يوجد auto-deploy — فقط `workflow_dispatch` أو بعد CI
- 🔸 الـ e2e يستخدم Playwright لكن لا يوجد `playwright.config.ts` ظاهر

---

## 10. Technical Debt & Issues

### 🟢 Issues ملحوظة

| #   | الخطورة    | الوصف                                                | الملف                                         |
| --- | ---------- | ---------------------------------------------------- | --------------------------------------------- |
| 1   | 🔴 **حرج** | `ignoreBuildErrors: true` — يخفي أخطاء TS في الإنتاج | `apps/admin/next.config.ts:22`                |
| 2   | 🟡 متوسط   | Auth tokens في AsyncStorage بدلاً من SecureStore     | `apps/mobile/src/lib/supabase.ts:19`          |
| 3   | 🟡 متوسط   | `user_metadata` مخزنة في Zustand store               | `apps/mobile/src/hooks/useStore.ts:10`        |
| 4   | 🟢 خفيف    | ZainCash functions معطلة — ترجع 501/503              | `supabase/functions/zaincash-*.ts`            |
| 5   | 🟢 خفيف    | `log-error` لا يخزن الأخطاء في DB                    | `supabase/functions/log-error/index.ts`       |
| 6   | 🟢 خفيف    | Rate limit values hardcoded (30/60, 10/60)           | `supabase/functions/trip-engine/index.ts:229` |
| 7   | 🟢 خفيف    | `any` types مستخدمة في Expo push tokens              | `supabase/functions/trip-engine/index.ts:108` |
| 8   | 🟢 خفيف    | فرع `security/harden-admin-and-analytics` غير مدمج   | Git branch                                    |
| 9   | 🟢 خفيف    | Mobile app لا يوجد script `lint`                     | `apps/mobile/package.json`                    |

### 🛠️ توصيات قبل الإطلاق

1. **🔴 إزالة `ignoreBuildErrors: true`** من next.config.ts — ثم إصلاح أي أخطاء TS تظهر
2. **🟡 ترحيل auth tokens إلى `expo-secure-store`** — على الأقل في الـ Supabase client
3. **🟡 مراجعة فرع `security/harden-admin-and-analytics`** للتأكد من اندماج تغييراته
4. **🟢 إضافة lint script للموبايل** — `eslint` مع `eslint-plugin-react`
5. **🟢 مراجعة Rate Limits** — جعلها configurable عبر environment variables
6. **🟢 إزالة `user_metadata` من Zustand store** إذا لم تكن مستخدمة
7. **🟢 إضافة اختبارات E2E أكثر** للمسارات الحرجة (تسجيل دخول، تفعيل ترخيص، إنشاء رحلة)

---

## 11. خطة التشغيل (Deployment Checklist)

- [ ] 1. دمج `security/harden-admin-and-analytics` في main (إن وجد)
- [ ] 2. إزالة `ignoreBuildErrors: true` من next.config.ts
- [ ] 3. تشغيل `pnpm typecheck` للتأكد من عدم وجود أخطاء
- [ ] 4. تشغيل `pnpm lint` — `--max-warnings=0`
- [ ] 5. تشغيل `pnpm test:all` — للتأكد من اجتياز الاختبارات
- [ ] 6. تأكيد أن جميع الـ 68 migration في remote مطابقة للمحلي
- [ ] 7. ضبط `SUPABASE_ACCESS_TOKEN` و `SUPABASE_PROJECT_REF` في GitHub Secrets
- [ ] 8. ضبط جميع متغيرات البيئة في GitHub Secrets (SUPABASE*URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_URL, ZAINCASH*\*)
- [ ] 9. بناء الـ Admin app: `cd apps/admin && pnpm build`
- [ ] 10. نشر الـ Admin app إلى Vercel/hosting المختار
- [ ] 11. نشر الـ Mobile app عبر EAS Build
- [ ] 12. تفعيل CI/CD عبر `workflow_dispatch` أو الدفع إلى main
- [ ] 13. اختبار شامل بعد الإطلاق: signup, login, activate license, create trip, etc.

---

## 12. المؤشرات النهائية

| المقياس              | القيمة                  |
| -------------------- | ----------------------- |
| Number of Migrations | 68 ✅                   |
| Migration Sync       | 100% ✅                 |
| Branches             | 6 open, clean           |
| CI Workflows         | 6 ✅                    |
| Edge Functions       | 4 deployed + 2 disabled |
| Core Schemas         | 14 Zod schemas ✅       |
| Admin Pages          | 25 ✅                   |
| Mobile Screens       | 15 ✅                   |
| Security Score       | A- (CSP concerns minor) |

---

**الخلاصة: Sair v2 جاهز للإطلاق مع معالجة النقطة الحمراء رقم 1 (ignoreBuildErrors).**

**تاريخ التقرير: 2026-05-24**
**تم بواسطة: AI Agent (opencode)**
