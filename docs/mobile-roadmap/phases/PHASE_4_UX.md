# 🎨 Phase 4 — تحسين تجربة المستخدم والتصميم

> **الأولوية:** 🔵 متوسطة — تحسينات لتجربة احترافية
> **المدة المتوقعة:** 4-5 أيام
> **الحالة:** ⬜ لم تبدأ
> **التقدم:** 0/10

---

## 🎯 الأهداف

1. رفع جودة التصميم لمستوى احترافي (Premium Feel)
2. إضافة Micro-animations وتفاعلات بصرية
3. تحسين شاشة الخريطة بمسار حقيقي
4. إضافة شاشة إشعارات
5. إضافة Empty States احترافية
6. تحسين أداء القوائم والتحميل

---

## 📋 المهام

### 4.1 ⬜ Animated Tab Bar مخصص

**الملف:** `apps/mobile/app/(tabs)/_layout.tsx`

**المطلوب:**

- [ ] تصميم Tab Bar مخصص بدل الافتراضي
- [ ] أيقونة نشطة مع تأثير bounce
- [ ] خط تحت الأيقونة النشطة بلون `Colors.primary`
- [ ] انتقال سلس بين الـ tabs
- [ ] ظل خفيف أعلى الـ Tab Bar

**التصميم:**

```
┌─────────────────────────────────────────┐
│                 ────────                │  ← shadow
│  🏠         📋         💬(2)      👤   │
│ الرئيسية    اشتراكاتي    الرسائل   الحساب │
│  ━━━                                   │  ← active indicator
└─────────────────────────────────────────┘
```

---

### 4.2 ⬜ Skeleton Loading لجميع الشاشات

**الملف الموجود:** `apps/mobile/src/components/LoadingSkeleton.tsx`

**المطلوب:**

- [ ] Skeleton لـ RouteCard (في الصفحة الرئيسية)
- [ ] Skeleton لـ SubscriptionCard
- [ ] Skeleton لـ TripCard (لوحة السائق)
- [ ] Skeleton لـ Chat Conversation Item
- [ ] استخدام `Animated` مع shimmer effect

```typescript
// مثال Shimmer
const shimmerAnim = useRef(new Animated.Value(0)).current;
Animated.loop(
  Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
).start();
```

---

### 4.3 ⬜ مسار خريطة حقيقي — OSRM Integration (F7)

**الملف:** `apps/mobile/src/components/TripMap.tsx`

**الوضع الحالي:** خط مستقيم بين النقطتين.

**المطلوب:**

- [ ] استدعاء OSRM API للحصول على مسار حقيقي:
  ```
  https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson
  ```
- [ ] رسم الـ Polyline باستخدام النقاط المرجعة
- [ ] تخزين مؤقت للمسار (لا نجلبه كل 5 ثوانٍ)
- [ ] Fallback للخط المستقيم إذا فشل الـ API

---

### 4.4 ⬜ شاشة سجل الإشعارات (F6)

**الملف الجديد:** `apps/mobile/app/notifications.tsx`

**المطلوب:**

- [ ] قائمة بآخر 50 إشعار من جدول `notifications` (يجب إنشاؤه)
- [ ] عرض: العنوان، المحتوى، التاريخ، حالة القراءة
- [ ] Swipe to dismiss
- [ ] زر "مسح الكل"
- [ ] أيقونة الإشعارات في Header الصفحة الرئيسية

**Migration المطلوب:**

```sql
CREATE TABLE IF NOT EXISTS notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  body text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

---

### 4.5 ⬜ Micro-Animations

**الملفات المتأثرة:** متعددة

**المطلوب:**

- [ ] **Login Button:** scale animation عند الضغط
- [ ] **RouteCard:** fade-in عند الظهور في القائمة (`Animated.FlatList` + `itemLayoutAnimation`)
- [ ] **Status Badge (Driver):** color transition عند تغير الحالة
- [ ] **Trip Completed → Rating:** slide-up animation
- [ ] **Tab Switch:** crossfade بدل الانتقال الحاد
- [ ] **Pull to Refresh:** branded animation بدل الافتراضي (اختياري)

---

### 4.6 ⬜ Empty States احترافية مع illustrations

**الملفات المتأثرة:** متعددة

**المطلوب:**

- [ ] استخدام `generate_image` tool لإنشاء 4-5 illustrations بسيطة:
  - لا خطوط متاحة
  - لا اشتراكات
  - لا رحلات
  - لا رسائل
  - لا إشعارات
- [ ] إضافة CTA button واضح في كل empty state
- [ ] تأثير bounce خفيف على الأيقونة

---

### 4.7 ⬜ تحسين شاشة الملف الشخصي (Profile)

**الملف:** `apps/mobile/app/profile.tsx`

**المطلوب:**

- [ ] إضافة صورة شخصية (avatar upload) — يمكن البدء بالأحرف الأولى
- [ ] إضافة قسم "الإحصائيات" (عدد الرحلات، التقييم المتوسط)
- [ ] إضافة قسم "الإعدادات" (الإشعارات، الخصوصية)
- [ ] إضافة رقم إصدار التطبيق في الأسفل
- [ ] إضافة رابط "تواصل معنا" / "الدعم"

---

### 4.8 ⬜ تحسين شاشة تتبع الرحلة

**الملف:** `apps/mobile/app/tracking/[tripId].tsx`

**المطلوب:**

- [ ] إضافة ETA (الوقت المتوقع للوصول) — يمكن حسابه من OSRM
- [ ] عرض المسافة المتبقية
- [ ] Timeline بصري يوضح مراحل الرحلة:
  ```
  ⬤ ─── ⬤ ─── ○ ─── ○
  مجدولة  السائق  في الطريق  اكتملت
          ينتظر
  ```
- [ ] إضافة زر "اتصال بالسائق" (فتح Dialer)
- [ ] إضافة زر "فتح محادثة" (متصل بـ Chat)

---

### 4.9 ⬜ تحسين RouteCard بمعلومات إضافية

**الملف:** `apps/mobile/src/components/RouteCard.tsx`

**المطلوب:**

- [ ] إضافة تقييم السائق (نجوم)
- [ ] إضافة عدد الرحلات المكتملة على هذا الخط
- [ ] إضافة مؤشر "قريباً" إذا كان هناك رحلة scheduled
- [ ] Badge "مشترك" إذا لدى الطالب اشتراك على هذا الخط

---

### 4.10 ⬜ Haptic Feedback للأزرار الحساسة

**الملفات المتأثرة:** متعددة

**المطلوب:**

- [ ] إضافة `expo-haptics` لـ package.json
- [ ] Haptic على: تغيير حالة الرحلة، إرسال تقييم، إلغاء اشتراك
- [ ] Light vibration على أزرار التنقل الرئيسية

---

## ✅ معايير إغلاق المرحلة

- [ ] التطبيق يبدو "Premium" — لا يوجد انتقالات حادة
- [ ] جميع الشاشات لديها Skeleton Loading
- [ ] الخريطة تعرض مسار حقيقي عبر الشوارع
- [ ] Empty States جميعها بتصميم احترافي
- [ ] شاشة الملف الشخصي تعرض إحصائيات حقيقية
