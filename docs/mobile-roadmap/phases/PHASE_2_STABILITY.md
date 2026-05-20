# 🟠 Phase 2 — الاستقرار، التعريب الكامل، ودعم RTL

> **الأولوية:** 🟠 عالية — مطلوب قبل الإطلاق
> **المدة المتوقعة:** 3 أيام
> **الحالة:** ⏳ قيد التنفيذ
> **التقدم:** 6/14

---

## 🎯 الأهداف

1. إزالة كل نص ثابت (hardcoded string) واستبداله بمفاتيح ترجمة
2. تطبيق RTL بشكل صحيح في جميع الشاشات
3. توحيد Design System في شاشات Chat
4. إصلاح أنماط Realtime Channels
5. تفعيل زر نسيت كلمة المرور

---

## 📋 المهام

### 2.1 ✅ ترجمة شاشة Onboarding (M1-a)

**الملف:** `apps/mobile/app/onboarding.tsx`

**المطلوب:**

- [x] استبدال نصوص `SLIDES` بمفاتيح ترجمة (`t('onboarding_1_title')` etc.)
- [x] استبدال `'تخطي'` بـ `t('skip')`
- [x] استبدال `'ابدأ الآن'` / `'التالي'` بـ `t('get_started')` / `t('next')`
- [x] إضافة `useTranslation()` للشاشة
- [x] إضافة مفاتيح ترجمة جديدة في `packages/core/index.ts` إن لزم

---

### 2.2 ✅ ترجمة عناوين Stack.Screen (M1-b)

**الملف:** `apps/mobile/app/_layout.tsx`

**المطلوب:**

- [x] تحويل جميع `title: 'نص ثابت'` إلى `title: t('key')`
- [x] تحويل `headerBackTitle: 'رجوع'` إلى `headerBackTitle: t('go_back_short')`
- [x] ملاحظة: Stack.Screen options يجب أن تُلف بـ function لأن `t()` يتغير

```typescript
// ✅ الطريقة الصحيحة
<Stack.Screen name="booking" options={{ title: t('book_trip') }} />
```

---

### 2.3 ✅ ترجمة النصوص الثابتة المتبقية (M1-c)

**الملفات المتأثرة:**

| الملف                   | النص                  | المفتاح المقترح        |
| ----------------------- | --------------------- | ---------------------- |
| `driver.tsx:26`         | `'حدث خطأ غير معروف'` | `t('error_generic')`   |
| `subscriptions.tsx:98`  | `'خط نقل'`            | `t('route')`           |
| `subscriptions.tsx:123` | `'د.ع'`               | `t('currency')`        |
| `TripMap.tsx:78`        | `'نقطة الانطلاق'`     | `t('start_point')`     |
| `TripMap.tsx:85`        | `'نقطة الوصول'`       | `t('end_point')`       |
| `TripMap.tsx:93`        | `'موقع السائق'`       | `t('driver_location')` |
| `profile.tsx:43`        | `'✓'`                 | `t('success')`         |

- [x] استبدال كل نص ثابت
- [x] التحقق أن المفاتيح موجودة في `Translations` (ar + en)

---

### 2.4 ✅ ترجمة شاشات Chat (M1-d + M2)

**الملفات:** `apps/mobile/app/chat/index.tsx` + `apps/mobile/app/chat/[id].tsx`

**المطلوب:**

- [x] إزالة جميع الـ fallback strings (`|| 'Messages'`, `|| 'Chat'`, etc.)
- [x] استبدال `fontWeight: '700'` بـ `fontFamily: FontFamily.bold`
- [x] استبدال `fontWeight: '600'` بـ `fontFamily: FontFamily.medium`
- [x] إضافة `import { FontFamily, Shadow } from '../../src/theme'`
- [x] التحقق أن كل text style يستخدم `fontFamily` بدل `fontWeight`

---

### 2.5 ⬜ إصلاح RTL في Chat (M3)

**الملفات:** `apps/mobile/app/chat/index.tsx` + `apps/mobile/app/chat/[id].tsx`

**المطلوب:**

- [ ] `chat/index.tsx:143` — `marginRight` → `marginStart` أو `marginHorizontal`
- [ ] `chat/[id].tsx:107` — `arrow-back` → `isRTL ? 'arrow-forward' : 'arrow-back'`
- [ ] `chat/[id].tsx:256` — `marginLeft` → `marginStart`
- [ ] إضافة `isRTL` checks لجميع `flexDirection: 'row'`

---

### 2.6 ⬜ تحويل `textAlign: 'right'` لتعتمد على RTL (M8)

**الملفات المتأثرة:**

| الملف                       | السطر          | الحل                                  |
| --------------------------- | -------------- | ------------------------------------- |
| `index.tsx:311`             | `sectionTitle` | `textAlign: isRTL ? 'right' : 'left'` |
| `subscriptions.tsx:229`     | `pageTitle`    | `textAlign: isRTL ? 'right' : 'left'` |
| `rating/[tripId].tsx:141`   | `label`        | `textAlign: isRTL ? 'right' : 'left'` |
| `rating/[tripId].tsx:149`   | `textInput`    | `textAlign: isRTL ? 'right' : 'left'` |
| `tracking/[tripId].tsx:333` | `infoLabel`    | `textAlign: isRTL ? 'right' : 'left'` |
| `tracking/[tripId].tsx:339` | `infoValue`    | `textAlign: isRTL ? 'right' : 'left'` |

- [ ] تحويل جميع المواقع
- [ ] ملاحظة: بعضها في `StyleSheet.create` — تحتاج نقل لـ inline style

---

### 2.7 ⬜ إصلاح RTL في LicenseActivationBanner (L4)

**الملف:** `apps/mobile/src/components/LicenseActivationBanner.tsx`

- [ ] `licenseBannerTitle:55` — `textAlign: 'right'` → dynamic
- [ ] `licenseBannerSubtitle:61` — `textAlign: 'right'` → dynamic
- [ ] إضافة `isRTL` لعكس `flexDirection` في `licenseBannerContent`

---

### 2.8 ⬜ إضافة Debounce لبحث Geocoding (M7)

**الملف:** `apps/mobile/app/index.tsx`

**المطلوب:**

```typescript
// إنشاء hook بسيط أو استخدام useRef + setTimeout
const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleSearch = (text: string) => {
  setSearchQuery(text);
  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  if (text.length < 3) {
    setSearchResults([]);
    return;
  }

  searchTimeoutRef.current = setTimeout(async () => {
    // ... fetch logic
  }, 500); // 500ms debounce
};
```

- [x] تنفيذ الـ debounce
- [x] اختبار أن الكتابة السريعة لا تُرسل طلبات زائدة

---

### 2.9 ⬜ تفعيل زر نسيت كلمة المرور (M9)

**الملف:** `apps/mobile/app/login.tsx`

**المطلوب:**

```typescript
const handleForgotPassword = async () => {
  if (!email.trim()) {
    Alert.alert(t('alert'), t('enter_email_first'));
    return;
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    Alert.alert(t('error'), error.message);
  } else {
    Alert.alert(t('sent'), t('reset_link_sent'));
  }
};
```

- [ ] ربط `onPress` بالدالة الجديدة

---

### 2.10 ⬜ إصلاح Realtime Channel Naming (M5)

**الملف:** `apps/mobile/src/hooks/useTrips.ts`

**المطلوب:**

- [ ] `driver-trips-realtime` → `driver-trips-${driverData.id}`
- [ ] `trips-active-realtime` → `trips-active-${user.id}`
- [ ] التأكد أن `supabase.removeChannel` يعمل بالاسم الصحيح

---

### 2.11 ✅ إصلاح `onViewableItemsChanged` Warning (L1)

**الملف:** `apps/mobile/app/onboarding.tsx`

```typescript
// ❌ قبل
const viewableItemsChanged = useRef(({...}) => {...}).current;

// ✅ بعد
const viewableItemsChanged = useCallback(({viewableItems}) => {
  if (viewableItems[0]) setCurrentIndex(viewableItems[0].index ?? 0);
}, []);
```

---

### 2.12 ⬜ إضافة إعادة تحميل التطبيق بعد تغيير اللغة (M4)

**الملف:** `apps/mobile/app/profile.tsx`

**المطلوب:**

```typescript
import * as Updates from 'expo-updates';

const handleLanguageChange = async (lang: 'ar' | 'en') => {
  setLanguage(lang);
  Alert.alert(t('language'), t('language_change_restart'), [
    { text: t('cancel'), style: 'cancel' },
    { text: t('ok'), onPress: () => Updates.reloadAsync() },
  ]);
};
```

- [ ] إضافة مفتاح ترجمة `language_change_restart`
- [ ] اختبار أن `I18nManager.forceRTL()` يسري بعد إعادة التحميل

---

### 2.13 ⬜ إصلاح Pagination في useSubscriptions (M6)

**الملف:** `apps/mobile/src/hooks/useTrips.ts`

**الوضع الحالي:** `page` يُمرر كـ argument لكن لا يوجد آلية لتغييره.

**المطلوب:**

- [ ] إضافة `loadMore()` function ترفع `page` بـ 1
- [ ] أو تحويل لـ infinite scroll pattern مع `onEndReached`

---

### 2.14 ⬜ إضافة مفاتيح ترجمة جديدة للميزات القادمة

**الملف:** `packages/core/index.ts`

**المطلوب:** إضافة مفاتيح ستُستخدم في المراحل القادمة:

```typescript
// مفاتيح جديدة مطلوبة
language_change_restart: 'سيتم إعادة تشغيل التطبيق لتطبيق اللغة الجديدة',
route: 'خط نقل',
// ... أي مفاتيح ناقصة
```

---

## ✅ معايير إغلاق المرحلة

- [ ] `grep -r "fontWeight" apps/mobile/app/chat/` يُرجع 0 نتائج
- [ ] `grep -r "textAlign: 'right'" apps/mobile/` — كل نتيجة مبررة (ثابتة للمحتوى العربي) أو ديناميكية
- [ ] لا يوجد أي نص ثابت عربي أو إنجليزي في ملفات `.tsx`
- [ ] تغيير اللغة من AR→EN والعكس يعمل بشكل كامل
- [ ] شاشات Chat تبدو متناسقة مع بقية التطبيق
