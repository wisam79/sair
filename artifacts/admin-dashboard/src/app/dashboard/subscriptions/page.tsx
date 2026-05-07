import React from 'react';
import { subscriptionRepository } from '@workspace/db/repositories';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
} from '@/components/ui';
import { subscriptionsSearchParamsCache } from '@/lib/search-params';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ar-IQ') + ' د.ع';
}

interface Props {
  searchParams?: Promise<Record<string, string>>;
}

export default async function SubscriptionsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = subscriptionsSearchParamsCache.parse(await searchParams ?? {});
  const page = params.page;
  const limit = params.limit;
  const offset = (page - 1) * limit;
  const statusFilter = params.status || 'all';
  const paymentStatusFilter = params.paymentStatus || 'all';

  const [subscriptions, totalCount] = await Promise.all([
    subscriptionRepository.findAllFiltered({
      limit,
      offset,
      status: statusFilter,
      paymentStatus: paymentStatusFilter,
    }),
    subscriptionRepository.countFiltered({
      status: statusFilter,
      paymentStatus: paymentStatusFilter,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  function pageUrl(p: number): string {
    const q = new URLSearchParams();
    q.set('page', String(p));
    q.set('limit', String(limit));
    if (params.status) q.set('status', params.status);
    if (params.paymentStatus) q.set('paymentStatus', params.paymentStatus);
    if (params.search) q.set('search', params.search);
    if (params.sortBy) q.set('sortBy', params.sortBy);
    if (params.sortOrder) q.set('sortOrder', params.sortOrder);
    return `/dashboard/subscriptions?${q.toString()}`;
  }

  function filterUrl(status: string, paymentStatus: string): string {
    const q = new URLSearchParams();
    if (status !== 'all') q.set('status', status);
    if (paymentStatus !== 'all') q.set('paymentStatus', paymentStatus);
    q.set('page', '1');
    q.set('limit', String(limit));
    return `/dashboard/subscriptions?${q.toString()}`;
  }

  const statusBadgeVariant: Record<
    string,
    'default' | 'destructive' | 'secondary' | 'success' | 'warning'
  > = {
    active: 'success',
    cancelled: 'destructive',
    expired: 'secondary',
    pending: 'warning',
  };

  const statusLabel: Record<string, string> = {
    active: 'نشط',
    cancelled: 'ملغى',
    expired: 'منتهي',
    pending: 'معلق',
  };

  const paymentBadgeVariant: Record<
    string,
    'default' | 'destructive' | 'secondary' | 'success' | 'warning'
  > = {
    paid: 'success',
    pending: 'warning',
    failed: 'destructive',
    refunded: 'default',
  };

  const paymentLabel: Record<string, string> = {
    paid: 'مدفوع',
    pending: 'قيد الانتظار',
    failed: 'فشل',
    refunded: 'مسترجع',
  };

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: 'نشط' },
    { value: 'cancelled', label: 'ملغى' },
    { value: 'expired', label: 'منتهي' },
  ];

  const paymentOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'paid', label: 'مدفوع' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'failed', label: 'فشل' },
    { value: 'refunded', label: 'مسترجع' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">إدارة الاشتراكات</h3>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">الحالة:</span>
            <div className="flex gap-1">
              {statusOptions.map((opt) => (
                <a
                  key={opt.value}
                  href={filterUrl(opt.value, paymentStatusFilter)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    statusFilter === opt.value
                      ? 'bg-[#0D2847] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">الدفع:</span>
            <div className="flex gap-1">
              {paymentOptions.map((opt) => (
                <a
                  key={opt.value}
                  href={filterUrl(statusFilter, opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    paymentStatusFilter === opt.value
                      ? 'bg-[#0D2847] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>السائق</TableHead>
              <TableHead>تاريخ البداية</TableHead>
              <TableHead>تاريخ النهاية</TableHead>
              <TableHead>الرسوم الشهرية</TableHead>
              <TableHead>العمولة</TableHead>
              <TableHead>صافي السائق</TableHead>
              <TableHead>حالة الدفع</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead align="center" dir="ltr">
                السفرات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium text-gray-900">
                  {sub.studentName || '-'}
                </TableCell>
                <TableCell className="text-gray-700">{sub.driverName || '-'}</TableCell>
                <TableCell className="text-gray-600">
                  {sub.startDate ? new Date(sub.startDate).toLocaleDateString('ar-IQ') : '-'}
                </TableCell>
                <TableCell className="text-gray-600">
                  {sub.endDate
                    ? new Intl.DateTimeFormat('ar-IQ', { timeZone: 'Asia/Baghdad' }).format(
                        new Date(sub.endDate),
                      )
                    : '-'}
                </TableCell>
                <TableCell className="text-gray-900 font-medium" dir="ltr">
                  {formatCurrency(sub.monthlyFee)}
                </TableCell>
                <TableCell className="text-gray-900" dir="ltr">
                  {formatCurrency(sub.commissionAmount)}
                </TableCell>
                <TableCell className="text-gray-900" dir="ltr">
                  {formatCurrency(sub.driverPayout)}
                </TableCell>
                <TableCell>
                  <Badge variant={paymentBadgeVariant[sub.paymentStatus] || 'secondary'}>
                    {paymentLabel[sub.paymentStatus] || sub.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[sub.status] || 'secondary'}>
                    {statusLabel[sub.status] || sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700 text-center" dir="ltr">
                  {sub.tripsUsed} / {sub.tripsPerMonth}
                </TableCell>
              </TableRow>
            ))}

            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  لا توجد اشتراكات مطابقة.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <span className="text-sm text-gray-500">
              إجمالي {totalCount.toLocaleString('ar-IQ')} اشتراك | صفحة {page} من {totalPages}
            </span>
            <div className="flex gap-2" dir="ltr">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                className={page <= 1 ? 'pointer-events-none text-gray-300 border-gray-200' : ''}
                onClick={() => window.location.href = pageUrl(Math.max(1, page - 1))}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className={
                  page >= totalPages ? 'pointer-events-none text-gray-300 border-gray-200' : ''
                }
                onClick={() => window.location.href = pageUrl(Math.min(totalPages, page + 1))}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
