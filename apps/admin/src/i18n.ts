import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Translations } from '@uniride/core';

const resources = {
  ar: {
    translation: {
      ...Translations.ar,
      documentTitle: {
        default: 'يونيرايد - لوحة التحكم',
      },
      dashboard: {
        title: 'الرئيسية',
        stats: {
          total_users: 'إجمالي المستخدمين',
          active_drivers: 'السائقون النشطون',
          active_routes: 'الخطوط الفعالة',
          active_trips: 'الرحلات الحية',
          total_routes: 'إجمالي الخطوط',
          total_trips: 'إجمالي الرحلات',
          active_subscriptions: 'الاشتراكات الفعالة',
          monthly_revenue: 'الأرباح الشهرية (د.ع)',
        },
        live_trips_notice_title: 'الرحلات الحية الان',
        live_trips_notice_desc: 'رحلة/رحلات نشطة حالياً. راجع التفاصيل في قسم الرحلات.',
      },
      profiles: {
        titles: {
          list: 'المستخدمين',
          show: 'عرض المستخدم',
          edit: 'تعديل المستخدم',
          create: 'إضافة مستخدم',
        },
        fields: {
          fullName: 'الاسم الكامل',
          phone: 'الهاتف',
          role: 'الدور',
          joined: 'تاريخ الانضمام',
        },
      },
      trips: {
        titles: {
          list: 'الرحلات الحية',
          show: 'عرض الرحلة',
          edit: 'تعديل الرحلة',
          create: 'إضافة رحلة',
        },
        fields: {
          status: 'الحالة',
          route: 'المسار',
          driver: 'السائق',
          scheduledAt: 'وقت الجدولة',
        },
      },
      routes: {
        titles: { list: 'الخطوط', show: 'عرض الخط', edit: 'تعديل الخط', create: 'إضافة خط' },
        fields: {
          title: 'العنوان',
          driver: 'السائق',
          startLocation: 'نقطة الانطلاق',
          endLocation: 'نقطة النهاية',
          price: 'السعر',
          capacity: 'السعة',
          availableSeats: 'المقاعد المتاحة',
          active: 'فعال',
        },
      },
      subscriptions: {
        titles: {
          list: 'الاشتراكات',
          show: 'عرض الاشتراك',
          edit: 'تعديل الاشتراك',
          create: 'إضافة اشتراك',
        },
        fields: {
          student: 'الطالب',
          route: 'الخط',
          status: 'الحالة',
          startDate: 'تاريخ البدء',
          endDate: 'تاريخ الانتهاء',
        },
      },
      license_batches: {
        titles: {
          list: 'دفعات التراخيص',
          show: 'عرض الدفعة',
          edit: 'تعديل الدفعة',
          create: 'إضافة دفعة',
        },
        fields: {
          name: 'اسم الدفعة',
          route: 'الخط',
          quantity: 'الكمية',
          price: 'السعر',
          validDays: 'أيام الصلاحية',
          createdAt: 'تاريخ الإنشاء',
        },
      },
      licenses: {
        titles: {
          list: 'التراخيص',
          show: 'عرض الترخيص',
          edit: 'تعديل الترخيص',
          create: 'إضافة ترخيص',
        },
        fields: {
          code: 'الكود',
          status: 'الحالة',
          usedBy: 'استخدم بواسطة',
          usedAt: 'تاريخ الاستخدام',
        },
      },
      drivers: {
        titles: {
          list: 'إدارة السائقين',
          show: 'عرض السائق',
          edit: 'تعديل السائق',
          create: 'إضافة سائق',
        },
      },
      actions: {
        actions: 'الإجراءات',
        edit: 'تعديل',
        show: 'عرض',
        create: 'إنشاء',
        delete: 'حذف',
        save: 'حفظ',
        cancel: 'إلغاء',
        export: 'تصدير',
      },
      buttons: {
        logout: 'تسجيل الخروج',
      },
      yes: 'نعم',
      no: 'لا',
    },
  },
  en: {
    translation: {
      ...Translations.en,
      documentTitle: {
        default: 'UniRide - Admin Dashboard',
      },
      dashboard: {
        title: 'Dashboard',
        stats: {
          total_users: 'Total Users',
          active_drivers: 'Active Drivers',
          active_routes: 'Active Routes',
          active_trips: 'Active Trips',
          total_routes: 'Total Routes',
          total_trips: 'Total Trips',
          active_subscriptions: 'Active Subscriptions',
          monthly_revenue: 'Monthly Revenue (IQD)',
        },
        live_trips_notice_title: 'Live Trips',
        live_trips_notice_desc: 'trip(s) currently active. View details in the Trips section.',
      },
      profiles: {
        titles: { list: 'Users', show: 'Show User', edit: 'Edit User', create: 'Create User' },
        fields: {
          fullName: 'Full Name',
          phone: 'Phone',
          role: 'Role',
          joined: 'Joined At',
        },
      },
      trips: {
        titles: { list: 'Live Trips', show: 'Show Trip', edit: 'Edit Trip', create: 'Create Trip' },
        fields: {
          status: 'Status',
          route: 'Route',
          driver: 'Driver',
          scheduledAt: 'Scheduled At',
        },
      },
      routes: {
        titles: { list: 'Routes', show: 'Show Route', edit: 'Edit Route', create: 'Create Route' },
        fields: {
          title: 'Title',
          driver: 'Driver',
          startLocation: 'Start Location',
          endLocation: 'End Location',
          price: 'Price',
          capacity: 'Capacity',
          availableSeats: 'Available Seats',
          active: 'Active',
        },
      },
      subscriptions: {
        titles: {
          list: 'Subscriptions',
          show: 'Show Subscription',
          edit: 'Edit Subscription',
          create: 'Create Subscription',
        },
        fields: {
          student: 'Student',
          route: 'Route',
          status: 'Status',
          startDate: 'Start Date',
          endDate: 'End Date',
        },
      },
      license_batches: {
        titles: {
          list: 'License Batches',
          show: 'Show Batch',
          edit: 'Edit Batch',
          create: 'Create Batch',
        },
        fields: {
          name: 'Batch Name',
          route: 'Route',
          quantity: 'Quantity',
          price: 'Price',
          validDays: 'Valid Days',
          createdAt: 'Created At',
        },
      },
      licenses: {
        titles: {
          list: 'Licenses',
          show: 'Show License',
          edit: 'Edit License',
          create: 'Create License',
        },
        fields: {
          code: 'Code',
          status: 'Status',
          usedBy: 'Used By',
          usedAt: 'Used At',
        },
      },
      drivers: {
        titles: {
          list: 'Drivers Management',
          show: 'Show Driver',
          edit: 'Edit Driver',
          create: 'Create Driver',
        },
      },
      actions: {
        actions: 'Actions',
      },
      yes: 'Yes',
      no: 'No',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // Default to Arabic
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
