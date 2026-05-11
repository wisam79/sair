import { z } from 'zod';

export const UserRole = z.enum(['admin', 'student', 'driver']);
export type UserRole = z.infer<typeof UserRole>;

export const MoneyAmount = z.number().int().min(0);

export const TripStatus = z.enum([
  'scheduled',
  'driver_waiting',
  'in_transit',
  'completed',
  'absent',
  'cancelled',
]);
export type TripStatus = z.infer<typeof TripStatus>;

export const ValidTransitions: Record<TripStatus, TripStatus[]> = {
  scheduled: ['driver_waiting', 'cancelled'],
  driver_waiting: ['in_transit', 'cancelled'],
  in_transit: ['completed', 'absent'],
  completed: [],
  absent: [],
  cancelled: [],
};

export function canTransition(from: TripStatus, to: TripStatus): boolean {
  return ValidTransitions[from]?.includes(to) ?? false;
}

export const GeoCoordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const BookingRequest = z.object({
  routeId: z.string().uuid(),
  studentId: z.string().uuid(),
});
export type BookingRequest = z.infer<typeof BookingRequest>;

export const TripUpdateRequest = z.object({
  tripId: z.string().uuid(),
  newStatus: TripStatus,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type TripUpdateRequest = z.infer<typeof TripUpdateRequest>;

export const SubscriptionStatus = z.enum(['pending', 'active', 'expired', 'cancelled']);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatus>;

export const InstitutionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  city: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Institution = z.infer<typeof InstitutionSchema>;

export const RouteSchema = z.object({
  id: z.string().uuid(),
  driver_id: z.string().uuid(),
  institution_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  start_location: z.string().min(1),
  end_location: z.string().min(1),
  price: z.number().int().min(0),
  capacity: z.number().int().min(1),
  available_seats: z.number().int().min(0),
  is_active: z.boolean(),
  start_lat: z.number().nullable().optional(),
  start_lng: z.number().nullable().optional(),
  end_lat: z.number().nullable().optional(),
  end_lng: z.number().nullable().optional(),
  departure_time: z.string().nullable().optional(),
  return_time: z.string().nullable().optional(),
});
export type Route = z.infer<typeof RouteSchema>;

export const RatingSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid(),
  student_id: z.string().uuid(),
  driver_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Rating = z.infer<typeof RatingSchema>;

export const TripSchema = z.object({
  id: z.string().uuid(),
  route_id: z.string().uuid(),
  driver_id: z.string().uuid(),
  status: TripStatus,
  scheduled_at: z.string(),
  started_at: z.string().nullable(),
  ended_at: z.string().nullable(),
  last_lat: z.number().nullable(),
  last_lng: z.number().nullable(),
});
export type Trip = z.infer<typeof TripSchema>;

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
  route_id: z.string().uuid(),
  status: SubscriptionStatus,
  start_date: z.string(),
  end_date: z.string(),
  created_at: z.string(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const LicenseStatus = z.enum(['active', 'used', 'revoked']);
export type LicenseStatus = z.infer<typeof LicenseStatus>;

export const LicenseSchema = z.object({
  id: z.string().uuid(),
  batch_id: z.string().uuid(),
  route_id: z.string().uuid(),
  code: z.string(),
  status: LicenseStatus,
  used_by: z.string().uuid().nullable().optional(),
  used_at: z.string().nullable().optional(),
  valid_days: z.number().int().min(1),
  created_at: z.string(),
});
export type License = z.infer<typeof LicenseSchema>;

export const LicenseBatchSchema = z.object({
  id: z.string().uuid(),
  created_by: z.string().uuid(),
  route_id: z.string().uuid(),
  batch_name: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  valid_days: z.number().int().min(1),
  created_at: z.string(),
});
export type LicenseBatch = z.infer<typeof LicenseBatchSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1),
  phone: z.string().min(1),
  role: UserRole,
  institution_id: z.string().uuid().nullable(),
  is_verified: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const Languages = z.enum(['ar', 'en']);
export type Language = z.infer<typeof Languages>;

export const Translations: Record<Language, Record<string, string>> = {
  ar: {
    welcome: 'مرحباً بك في يونيرايد',
    book_now: 'احجز الآن',
    no_seats: 'عذراً، لا توجد مقاعد متاحة',
    trip_started: 'بدأت الرحلة',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loading: 'جاري التحميل...',
    available_routes: 'الخطوط المتاحة',
    my_subscriptions: 'اشتراكاتي',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    driver_dashboard: 'لوحة السائق',
    start_trip: 'بدء الرحلة',
    end_trip: 'إنهاء الرحلة',
    cancel_trip: 'إلغاء الرحلة',
    waiting_for_driver: 'في انتظار السائق',
    in_transit: 'في الطريق',
    completed: 'مكتملة',
    cancelled: 'ملغاة',
    scheduled: 'مجدولة',
    absent: 'غائب',
    driver_waiting: 'السائق ينتظر',
    from: 'من',
    to: 'إلى',
    price: 'السعر',
    seats_available: 'مقاعد متاحة',
    seat_reserved: 'تم حجز المقعد بنجاح!',
    booking_failed: 'فشل الحجز',
    live_tracking: 'التتبع المباشر',
    no_active_trips: 'لا توجد رحلات نشطة',
    confirm_booking: 'تأكيد الحجز',
    route_details: 'تفاصيل الخط',
    subscription_active: 'فعال',
    subscription_expired: 'منتهي',
    subscription_cancelled: 'ملغي',
    subscription_pending: 'قيد الانتظار',
    error_generic: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    no_internet: 'لا يوجد اتصال بالإنترنت',
    cancel_subscription: 'إلغاء الاشتراك',
    save: 'حفظ',
    phone: 'الهاتف',
    language: 'اللغة',
    retry: 'إعادة المحاولة',
    go_back: 'رجوع',
    are_you_sure: 'هل أنت متأكد؟',
    no: 'لا',
    yes: 'نعم',
    updated_successfully: 'تم التحديث بنجاح',
    something_went_wrong: 'حدث خطأ ما',
    try_again: 'حاول مرة أخرى',
    check_inbox: 'يرجى التحقق من بريدك الإلكتروني للتحقق',
    invalid_transition: 'انتقال حالة غير صالح',
    cancel_confirmation: 'هل أنت متأكد من إلغاء هذا الاشتراك؟',
  },
  en: {
    welcome: 'Welcome to UniRide',
    book_now: 'Book Now',
    no_seats: 'Sorry, no seats available',
    trip_started: 'Trip Started',
    login: 'Login',
    signup: 'Create Account',
    email: 'Email',
    password: 'Password',
    loading: 'Loading...',
    available_routes: 'Available Routes',
    my_subscriptions: 'My Subscriptions',
    profile: 'Profile',
    logout: 'Logout',
    driver_dashboard: 'Driver Dashboard',
    start_trip: 'Start Trip',
    end_trip: 'End Trip',
    cancel_trip: 'Cancel Trip',
    waiting_for_driver: 'Waiting for Driver',
    in_transit: 'In Transit',
    completed: 'Completed',
    cancelled: 'Cancelled',
    scheduled: 'Scheduled',
    absent: 'Absent',
    driver_waiting: 'Driver Waiting',
    from: 'From',
    to: 'To',
    price: 'Price',
    seats_available: 'seats available',
    seat_reserved: 'Seat reserved successfully!',
    booking_failed: 'Booking failed',
    live_tracking: 'Live Tracking',
    no_active_trips: 'No active trips',
    confirm_booking: 'Confirm Booking',
    route_details: 'Route Details',
    subscription_active: 'Active',
    subscription_expired: 'Expired',
    subscription_cancelled: 'Cancelled',
    subscription_pending: 'Pending',
    error_generic: 'An error occurred, please try again',
    no_internet: 'No internet connection',
    cancel_subscription: 'Cancel Subscription',
    save: 'Save',
    phone: 'Phone',
    language: 'Language',
    retry: 'Retry',
    go_back: 'Go Back',
    are_you_sure: 'Are you sure?',
    no: 'No',
    yes: 'Yes',
    updated_successfully: 'Updated successfully',
    something_went_wrong: 'Something went wrong',
    try_again: 'Try Again',
    check_inbox: 'Please check your inbox for email verification',
    invalid_transition: 'Invalid status transition',
    cancel_confirmation: 'Are you sure you want to cancel this subscription?',
  },
};

// NOTE: Theme tokens are defined in apps/mobile/src/theme/ — do not add here.
