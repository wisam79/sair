# 🔴 Phase 1 — إصلاحات أمنية وتبعيات حرجة

> **الأولوية:** 🔴 حرجة — يجب إنجازها قبل أي شيء آخر
> **المدة المتوقعة:** يوم واحد
> **الحالة:** 🟢 مكتمل
> **التقدم:** 8/8

---

## 🎯 الأهداف

1. سد جميع الثغرات الأمنية المكتشفة
2. إصلاح التبعيات المكسورة
3. إزالة `any` من الكود بالكامل
4. ضمان أن العمليات الحساسة تمر عبر RPCs

---

## 📋 المهام

### 1.1 ✅ إصلاح اختيار الدور عند التسجيل (C1)

**الملف:** `apps/mobile/app/login.tsx`
**الخطورة:** 🔴 حرجة — Privilege Escalation

**الوضع الحالي:**

```typescript
// login.tsx:64-85 — الدور المختار (selectedRole) لا يُرسل فعلياً
// لكن وجود الحقل في الواجهة مضلّل ويمكن أن يُستغل مستقبلاً
```

**المطلوب:**

- [x] إزالة حقل اختيار الدور (`student`/`driver`) من واجهة التسجيل بالكامل
- [x] إزالة `selectedRole` state و `UserRole` import إن لم يُستخدم
- [x] إضافة نص توضيحي: "سيتم تحديد دورك من قبل الإدارة"
- [x] التأكد أن الدور يُسند فقط من Admin Dashboard

**ملاحظات التحقق:**

- [x] لا يوجد أي ذكر لـ `role` في `signUp` options
- [x] التطبيق يعمل بالتسجيل بدون اختيار دور

---

### 1.2 ✅ استبدال إلغاء الاشتراك المباشر بـ RPC (C2)

**الملف:** `apps/mobile/app/subscriptions.tsx`
**الخطورة:** 🔴 حرجة — يتجاوز Business Logic

**الوضع الحالي:**

```typescript
// subscriptions.tsx:66-72
const { error } = await supabase
  .from('subscriptions')
  .update({ status: 'cancelled' })
  .eq('id', subscriptionId);
```

**المطلوب:**

- [x] إنشاء RPC `cancel_subscription(p_subscription_id uuid)` في migration جديد
- [x] التحقق داخل RPC من: الملكية (`student_id = auth.uid()`), الحالة (`active` أو `pending`)
- [x] إعادة المقعد للـ Route عند الإلغاء (`available_seats += 1`)
- [x] استبدال `supabase.from().update()` بـ `supabase.rpc('cancel_subscription')`

**ملاحظات التحقق:**

- [x] لا يمكن إلغاء اشتراك شخص آخر
- [x] لا يمكن إلغاء اشتراك بحالة `expired` أو `cancelled`

---

### 1.3 ✅ إضافة `expo-secure-store` لـ package.json (C3)

**الملف:** `apps/mobile/package.json` + `apps/mobile/src/lib/offlineCache.ts`

**المطلوب:**

- [x] تشغيل `pnpm add expo-secure-store` داخل `apps/mobile/`
- [x] التحقق أن `offlineCache.ts` يعمل بدون أخطاء
- [x] اختبار حفظ/قراءة الاشتراك المخزن مؤقتاً

---

### 1.4 ✅ إزالة `any` من index.tsx (C4-a)

**الملف:** `apps/mobile/app/index.tsx`

**المطلوب:**

```typescript
// ❌ قبل
const [searchResults, setSearchResults] = useState<any[]>([]);

// ✅ بعد
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}
const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
```

---

### 1.5 ✅ إزالة `any` من onboarding.tsx (C4-b)

**الملف:** `apps/mobile/app/onboarding.tsx`

**المطلوب:**

```typescript
// ❌ قبل
const slidesRef = useRef<any>(null);

// ✅ بعد
import { FlatList } from 'react-native';
const slidesRef = useRef<FlatList>(null);
```

---

### 1.6 ✅ إزالة unsafe cast من driver.tsx (C4-c)

**الملف:** `apps/mobile/app/driver.tsx`

**المطلوب:**

```typescript
// ❌ قبل
data={trips as unknown as DriverTrip[]}

// ✅ بعد — تعديل useDriverTrips ليُرجع DriverTrip[] مباشرة
// أو استخدام type assertion آمن مع validation
```

---

### 1.7 ✅ مسح Offline Cache عند Logout (M10)

**الملف:** `apps/mobile/src/hooks/useStore.ts`

**المطلوب:**

```typescript
// ❌ قبل
logout: () => set({ user: null, role: null, profile: null }),

// ✅ بعد
logout: () => {
  OfflineCache.clear();
  set({ user: null, role: null, profile: null });
},
```

---

### 1.8 ✅ تسجيل شاشات Chat في Layout (L5)

**الملف:** `apps/mobile/app/_layout.tsx`

**المطلوب:**

```typescript
<Stack.Screen name="chat/index" options={{ title: t('messages') }} />
<Stack.Screen name="chat/[id]" options={{ title: t('chat') }} />
```

---

## ✅ معايير إغلاق المرحلة

- [x] لا يوجد أي `any` في الكود
- [x] جميع العمليات الحساسة تمر عبر RPCs
- [x] التطبيق يُبنى بدون أخطاء TypeScript
- [x] جميع التبعيات موجودة في `package.json`
