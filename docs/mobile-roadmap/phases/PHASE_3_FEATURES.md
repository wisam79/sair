# 🟢 Phase 3 — الميزات الأساسية الناقصة

> **الأولوية:** 🟢 عالية — ميزات مطلوبة للإطلاق
> **المدة المتوقعة:** 5-7 أيام
> **الحالة:** 🟢 مكتمل
> **التقدم:** 12/12

---

## 🎯 الأهداف

1. إضافة Bottom Tab Navigation لتجربة مستخدم احترافية
2. ربط نظام الدردشة بالتنقل الرئيسي
3. بناء واجهة الدفع (ZainCash)
4. إضافة شاشة سجل الرحلات
5. بناء واجهة سحب الأرباح للسائق
6. حفظ حالة Onboarding

---

## 📋 المهام

### 3.1 ✅ Bottom Tab Navigation — الهيكل الأساسي (F5)

**الملفات الجديدة:**

- `apps/mobile/app/(tabs)/_layout.tsx` — Tab Navigator
- `apps/mobile/app/(tabs)/index.tsx` — الصفحة الرئيسية (نقل من `app/index.tsx`)
- `apps/mobile/app/(tabs)/subscriptions.tsx` — الاشتراكات
- `apps/mobile/app/(tabs)/chat.tsx` — الرسائل
- `apps/mobile/app/(tabs)/profile.tsx` — الحساب

**المطلوب:**

- [x] إنشاء `(tabs)` group بـ Expo Router
- [x] تصميم Tab Bar سفلي بأيقونات وألوان Design System
- [x] نقل الشاشات الرئيسية داخل tabs
- [x] إبقاء الشاشات الفرعية (booking, tracking, etc.) خارج tabs كـ modals/stack
- [x] إضافة badge للرسائل غير المقروءة

**التصميم المقترح للـ Tabs:**

```
┌────────┬────────┬────────┬────────┐
│  🏠    │  📋    │  💬    │  👤    │
│ الرئيسية │ اشتراكاتي │ الرسائل │ الحساب │
└────────┴────────┴────────┴────────┘
```

**لوحة السائق:** Tabs مختلفة:

```
┌────────┬────────┬────────┐
│  🚗    │  💬    │  👤    │
│ رحلاتي │ الرسائل │ الحساب │
└────────┴────────┴────────┘
```

---

### 3.2 ✅ ربط Chat بشاشة التتبع (F1-a)

**الملف:** `apps/mobile/app/tracking/[tripId].tsx`

**المطلوب:**

- [x] إضافة زر "محادثة السائق" في شاشة التتبع
- [x] استخدام `useConversationForTrip(tripId)` لفتح/إنشاء محادثة
- [x] التنقل إلى `chat/[id]` عند الضغط

```typescript
const { conversation, getOrCreate } = useConversationForTrip(tripId);

const handleOpenChat = async () => {
  const conv = await getOrCreate();
  if (conv) {
    router.push({ pathname: '/chat/[id]', params: { id: conv.id } });
  }
};
```

---

### 3.3 ✅ مؤشر رسائل غير مقروءة (F1-b)

**الملفات:** `src/hooks/useMessages.ts` + Tab Navigator

**المطلوب:**

- [x] إنشاء hook `useUnreadCount()` يحسب الرسائل غير المقروءة
- [x] عرض Badge على أيقونة Chat في Tab Bar
- [x] تحديث العدد عبر Realtime subscription

---

### 3.4 ✅ واجهة الدفع — ZainCash (F2)

**الملف الجديد:** `apps/mobile/app/payment.tsx`

**المطلوب:**

- [x] شاشة تعرض تفاصيل الخط والسعر
- [x] زر "ادفع عبر ZainCash" يستدعي Edge Function `zaincash-checkout`
- [x] عرض WebView لإكمال الدفع على موقع ZainCash
- [x] معالجة callback بعد الدفع (نجاح/فشل)
- [x] ربط مع `activate.tsx` — بعد الدفع الناجح يُعطى كود ترخيص

**الهيكل المقترح:**

```
RouteCard → booking.tsx → payment.tsx → [ZainCash WebView] → activate.tsx
```

**ملاحظة:** يجب مراجعة Edge Functions `zaincash-checkout` و `zaincash-webhook` أولاً لفهم الـ API contract.

---

### 3.5 ✅ شاشة سجل الرحلات — الطالب (F3)

**الملف الجديد:** `apps/mobile/app/trip-history.tsx`

**المطلوب:**

- [x] Hook جديد `useTripHistory()` يجلب الرحلات المكتملة للطالب
- [x] Query: الرحلات على الخطوط المشترك بها الطالب بحالة `completed`
- [x] عرض FlatList مع: اسم الخط، التاريخ، اسم السائق، التقييم
- [x] Pagination مع infinite scroll
- [x] فلتر بالتاريخ (اختياري)

**مفاتيح الترجمة المطلوبة:**

```typescript
trip_history: 'سجل الرحلات',
no_trips_found: 'لا توجد رحلات سابقة',
trip_date: 'تاريخ الرحلة',
```

---

### 3.6 ✅ واجهة سحب الأرباح — السائق (F4)

**الملف الجديد:** `apps/mobile/app/payouts.tsx`

**المطلوب:**

- [x] عرض الرصيد المتاح للسحب (من RPC `get_driver_balance`)
- [x] زر "طلب سحب" يستدعي RPC `request_payout`
- [x] قائمة طلبات السحب السابقة مع حالاتها (pending/completed/rejected)
- [x] تصميم بطاقة رصيد أنيقة في أعلى الشاشة

**مفاتيح الترجمة المطلوبة:**

```typescript
available_balance: 'الرصيد المتاح',
withdraw_request: 'طلب سحب',
payout_history: 'سجل عمليات السحب',
payout_pending: 'قيد المراجعة',
payout_completed: 'تم الصرف',
payout_rejected: 'مرفوض',
```

---

### 3.7 ✅ حفظ حالة Onboarding (F10)

**الملفات:** `apps/mobile/app/_layout.tsx` + `apps/mobile/app/onboarding.tsx` + `apps/mobile/src/hooks/useStore.ts`

- [x] إضافة `hasSeenOnboarding` إلى Zustand store
- [x] منع عرض الشاشة أكثر من مرة
- [x] استخدام `router.replace` بدل التنقل العادي

---

### 3.8 ✅ Deep Linking للإشعارات (L3)

**الملف:** `apps/mobile/src/hooks/useNotifications.ts`

**المطلوب:**

```typescript
const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;

  if (data?.type === 'trip_update' && data?.tripId) {
    router.push({ pathname: '/tracking/[tripId]', params: { tripId: data.tripId } });
  } else if (data?.type === 'message' && data?.conversationId) {
    router.push({ pathname: '/chat/[id]', params: { id: data.conversationId } });
  }
});
```

---

### 3.9 ✅ إضافة RPC `get_driver_balance` (DB)

**الملف الجديد:** `supabase/migrations/YYYYMMDDNN_driver_balance_rpc.sql`

```sql
CREATE OR REPLACE FUNCTION get_driver_balance()
RETURNS TABLE(total_earned numeric, total_paid numeric, available_balance numeric)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- حساب الأرباح من الاشتراكات على خطوط السائق
  -- ناقص المبالغ المسحوبة
END;
$$;
```

---

### 3.10 ✅ إضافة RPC `cancel_subscription` (DB)

**الملف الجديد:** `supabase/migrations/YYYYMMDDNN_cancel_subscription.sql`

```sql
CREATE OR REPLACE FUNCTION cancel_subscription(p_subscription_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_sub subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO v_sub FROM subscriptions
    WHERE id = p_subscription_id
    AND student_id = auth.uid()
    FOR UPDATE NOWAIT;

  IF NOT FOUND THEN RAISE EXCEPTION 'Subscription not found'; END IF;
  IF v_sub.status NOT IN ('active', 'pending') THEN
    RAISE EXCEPTION 'Cannot cancel: status is %', v_sub.status;
  END IF;

  UPDATE subscriptions SET status = 'cancelled' WHERE id = p_subscription_id;
  UPDATE routes SET available_seats = available_seats + 1 WHERE id = v_sub.route_id;
END;
$$;
```

---

### 3.11 ✅ إضافة hook `useUnreadCount` (Chat)

**الملف الجديد:** `apps/mobile/src/hooks/useUnreadCount.ts`

**المطلوب:**

- [x] RPC `get_unread_count()` — يحسب الرسائل غير المقروءة للمستخدم
- [x] Hook يستخدم الـ RPC + Realtime subscription
- [x] يُستخدم في Tab Bar لعرض Badge

---

### 3.12 ✅ إضافة مفاتيح ترجمة Phase 3

**الملف:** `packages/core/index.ts`

- [x] إضافة جميع المفاتيح الجديدة المذكورة في هذا الملف
- [x] التأكد من وجودها في `ar` و `en`

---

## ✅ معايير إغلاق المرحلة

- [x] Tab Navigation يعمل لكل من الطالب والسائق
- [x] الطالب يمكنه فتح Chat من شاشة التتبع
- [x] واجهة الدفع تعمل end-to-end (أو mock إذا ZainCash API غير جاهز)
- [x] شاشة سجل الرحلات تعرض بيانات حقيقية
- [x] السائق يرى رصيده ويطلب سحب
- [x] Onboarding يظهر مرة واحدة فقط
- [x] الإشعارات تنقل للشاشة المناسبة عند الضغط
