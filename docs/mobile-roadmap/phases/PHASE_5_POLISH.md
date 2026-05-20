# 🏆 Phase 5 — التلميع النهائي، الأداء، والتجهيز للإطلاق

> **الأولوية:** 🔵 متوسطة — تحسينات ما قبل الإطلاق
> **المدة المتوقعة:** 3-4 أيام
> **الحالة:** ⬜ لم تبدأ
> **التقدم:** 0/8

---

## 🎯 الأهداف

1. تحسين الأداء (ذاكرة، بطارية، شبكة)
2. إضافة آليات أمان متقدمة
3. إعداد التطبيق للنشر على المتاجر
4. إدارة اشتراكات متعددة
5. ميزات أمان إضافية (SOS)
6. Force Update mechanism

---

## 📋 المهام

### 5.1 ⬜ Force Update Mechanism (L2)

**الملف:** `apps/mobile/app/_layout.tsx`

**المطلوب:**

- [ ] إنشاء RPC `get_app_config()` يُرجع `min_version` و `latest_version`
- [ ] مقارنة إصدار التطبيق الحالي مع `min_version`
- [ ] إذا كان أقل → عرض شاشة "يجب تحديث التطبيق" (blocking modal)
- [ ] إذا كان أقل من `latest_version` → عرض "تحديث متاح" (optional)
- [ ] استخدام `expo-updates` للتحديثات OTA

```typescript
// في _layout.tsx بعد التهيئة
useEffect(() => {
  async function checkVersion() {
    const { data } = await supabase.rpc('get_app_config');
    const currentVersion = Constants.expoConfig?.version || '0.0.0';
    if (data?.min_version && currentVersion < data.min_version) {
      setForceUpdateRequired(true);
    }
  }
  checkVersion();
}, []);
```

---

### 5.2 ⬜ إدارة اشتراكات متعددة (F8)

**الملفات:** `apps/mobile/app/index.tsx` + `apps/mobile/app/subscriptions.tsx`

**الوضع الحالي:** `activeSub = subscriptions.find(s => s.status === 'active')` — يأخذ الأول فقط.

**المطلوب:**

- [ ] عرض جميع الاشتراكات النشطة في الصفحة الرئيسية (carousel أو قائمة)
- [ ] إمكانية التبديل بين اشتراكات نشطة لتتبع خطوط مختلفة
- [ ] عرض عدد الاشتراكات النشطة في Tab Badge

---

### 5.3 ⬜ زر طوارئ SOS (F9)

**الملف الجديد:** `apps/mobile/src/components/SOSButton.tsx`
**الشاشة:** يظهر في `tracking/[tripId].tsx` أثناء حالة `in_transit`

**المطلوب:**

- [ ] زر SOS كبير وواضح (أحمر) في شاشة التتبع
- [ ] عند الضغط المطوّل (3 ثوانٍ):
  1. إرسال إشعار طوارئ للـ Admin
  2. مشاركة الموقع الحالي
  3. فتح Dialer لرقم الطوارئ
- [ ] تسجيل الحدث في جدول `emergency_reports`

---

### 5.4 ⬜ تحسين أداء الذاكرة

**الملفات المتأثرة:** متعددة

**المطلوب:**

- [ ] **GPS Queue:** تحديد حد أقصى لحجم القائمة (مثلاً 100 نقطة)
- [ ] **Realtime Channels:** التأكد أن جميع القنوات تُزال عند unmount
- [ ] **Images:** إضافة تخزين مؤقت للصور إن وُجدت
- [ ] **FlatList:** التحقق أن `removeClippedSubviews` مفعّل في كل FlatList
- [ ] **Memory Leak Audit:** مراجعة كل `useEffect` للتأكد من وجود cleanup

---

### 5.5 ⬜ تحسين استهلاك البطارية — GPS

**الملف:** `apps/mobile/src/hooks/useTrips.ts` (`useLocationTracker`)

**المطلوب:**

- [ ] خفض `accuracy` إلى `Balanced` عندما تكون السرعة منخفضة
- [ ] زيادة `timeInterval` إلى 10000ms عند التوقف
- [ ] تقليل `distanceInterval` ديناميكياً
- [ ] إضافة Background Location Tracking (يتطلب `expo-task-manager`)
- [ ] عرض إشعار "الموقع قيد التتبع" في notification bar

---

### 5.6 ⬜ تحسين أمان التطبيق — Rate Limiting Client-Side

**الملف الجديد:** `apps/mobile/src/lib/rateLimiter.ts`

**المطلوب:**

```typescript
// منع الضغط المتكرر على الأزرار الحساسة
export class ClientRateLimiter {
  private timestamps = new Map<string, number>();

  canProceed(action: string, cooldownMs: number = 2000): boolean {
    const last = this.timestamps.get(action) || 0;
    if (Date.now() - last < cooldownMs) return false;
    this.timestamps.set(action, Date.now());
    return true;
  }
}
```

- [ ] تطبيق على: إرسال رسالة، إلغاء اشتراك، تغيير حالة رحلة

---

### 5.7 ⬜ إعداد EAS Build & Submit

**الملفات:** `apps/mobile/eas.json` + `apps/mobile/app.json`

**المطلوب:**

- [ ] مراجعة `eas.json` — بيئات development, preview, production
- [ ] إعداد `app.json`:
  - Bundle identifier صحيح
  - Permissions مطلوبة (Location, Notifications, Camera)
  - Splash screen و adaptive icon
  - Version و buildNumber
- [ ] اختبار `eas build --profile preview`
- [ ] إعداد `eas submit` لـ Google Play (و App Store إن لزم)

---

### 5.8 ⬜ E2E Testing للمسارات الحرجة

**الملف الجديد:** `tests/mobile/critical-flows.test.ts`

**المطلوب:**

- [ ] Test: تسجيل → تسجيل دخول → تفعيل ترخيص → تتبع رحلة
- [ ] Test: سائق → إنشاء رحلة → تغيير الحالة → إنهاء
- [ ] Test: تغيير اللغة → التحقق من RTL
- [ ] Test: Offline → Online → GPS Queue flush

---

## ✅ معايير إغلاق المرحلة

- [ ] التطبيق يُبنى بنجاح عبر EAS (Android + iOS)
- [ ] Force Update يعمل عند تغيير `min_version`
- [ ] SOS يُرسل إشعار للأدمن فعلياً
- [ ] لا يوجد memory leaks واضحة (profiling)
- [ ] E2E Tests تمر بنجاح
- [ ] التطبيق جاهز للنشر على Google Play

---

## 📊 التقييم المتوقع بعد إكمال جميع المراحل

| المجال            | قبل        | بعد        | الفرق    |
| ----------------- | ---------- | ---------- | -------- |
| 🔐 الأمان         | 4/10       | 8/10       | +4       |
| 🧠 المنطق         | 6/10       | 9/10       | +3       |
| 🎨 الواجهة        | 7/10       | 9/10       | +2       |
| ⚡ الأداء         | 6/10       | 8/10       | +2       |
| 🧩 اكتمال الميزات | 5/10       | 9/10       | +4       |
| 🗄️ التبعيات       | 5/10       | 9/10       | +4       |
| **الإجمالي**      | **5.5/10** | **8.7/10** | **+3.2** |
