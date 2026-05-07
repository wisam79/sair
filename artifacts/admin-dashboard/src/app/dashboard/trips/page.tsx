import React from 'react';
import { db, tripsTable } from '@workspace/db';
import { profilesTable } from '@workspace/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import Link from 'next/link';
import {
  Button,
  Input,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from '@/components/ui';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const STATUSES = [
  { value: '', label: 'الكل' },
  { value: 'scheduled', label: 'مجدولة' },
  { value: 'in_transit', label: 'جارية' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'cancelled', label: 'ملغاة' },
] as const;

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'مجدولة',
  driver_waiting: 'بانتظار السائق',
  in_transit: 'جارية',
  completed: 'مكتملة',
  absent: 'غائب',
  cancelled: 'ملغاة',
};

const STATUS_VARIANTS: Record<
  string,
  'default' | 'destructive' | 'secondary' | 'success' | 'warning'
> = {
  scheduled: 'warning',
  driver_waiting: 'warning',
  in_transit: 'default',
  completed: 'success',
  absent: 'destructive',
  cancelled: 'secondary',
};

const DIRECTION_VARIANTS: Record<string, 'default' | 'success'> = {
  go: 'default',
  return: 'success',
};

interface Props {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function TripsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = (await searchParams) || {};
  const page = Math.max(1, parseInt((params as any).page || '1'));
  const limit = Math.min(100, Math.max(10, parseInt((params as any).limit || '20')));
  const offset = (page - 1) * limit;
  const statusFilter = (params as any).status || '';
  const dateFrom = (params as any).dateFrom || '';
  const dateTo = (params as any).dateTo || '';

  const conditions: ReturnType<typeof eq>[] = [];

  if (statusFilter) {
    conditions.push(eq(tripsTable.status, statusFilter));
  }

  if (dateFrom) {
    conditions.push(gte(tripsTable.tripDate, dateFrom));
  }

  if (dateTo) {
    conditions.push(lte(tripsTable.tripDate, dateTo));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [tripRows, countResult] = await Promise.all([
    db
      .select({
        id: tripsTable.id,
        direction: tripsTable.direction,
        tripDate: tripsTable.tripDate,
        status: tripsTable.status,
        startedAt: tripsTable.startedAt,
        endedAt: tripsTable.endedAt,
        createdAt: tripsTable.createdAt,
        driverId: tripsTable.driverId,
        driverFullName: profilesTable.fullName,
        driverPhone: profilesTable.phone,
      })
      .from(tripsTable)
      .leftJoin(profilesTable, eq(tripsTable.driverId, profilesTable.id))
      .where(whereClause)
      .orderBy(desc(tripsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(tripsTable)
      .where(whereClause),
  ]);

  const totalCount = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.ceil(totalCount / limit);

  const buildUrl = (overrides: Record<string, string>) => {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (statusFilter) q.set('status', statusFilter);
    if (dateFrom) q.set('dateFrom', dateFrom);
    if (dateTo) q.set('dateTo', dateTo);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    return `/dashboard/trips?${q.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">متابعة السفرات</h3>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <form className="flex flex-wrap items-end gap-4" dir="rtl">
          <Select
            label="الحالة"
            name="status"
            defaultValue={statusFilter}
            options={STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          />

          <Input label="من تاريخ" type="date" name="dateFrom" defaultValue={dateFrom} />

          <Input label="إلى تاريخ" type="date" name="dateTo" defaultValue={dateTo} />

          <div className="flex gap-2">
            <Button type="submit" size="sm">
              تصفية
            </Button>
            <a href="/dashboard/trips">
              <Button variant="outline" size="sm">
                إعادة تعيين
              </Button>
            </a>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>التاريخ</TableHead>
              <TableHead>الاتجاه</TableHead>
              <TableHead>السائق</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>وقت البدء</TableHead>
              <TableHead>وقت الانتهاء</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripRows.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium text-gray-900">
                  {new Date(trip.tripDate).toLocaleDateString('ar-IQ')}
                </TableCell>
                <TableCell>
                  <Badge variant={DIRECTION_VARIANTS[trip.direction] || 'default'}>
                    {trip.direction === 'go' ? 'ذهاب' : 'عودة'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">
                  {trip.driverFullName ? (
                    <div>
                      <span>{trip.driverFullName}</span>
                      {trip.driverPhone && (
                        <span className="text-gray-400 text-xs block" dir="ltr">
                          {trip.driverPhone}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[trip.status] || 'secondary'}>
                    {STATUS_LABELS[trip.status] || trip.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">
                  {trip.startedAt ? new Date(trip.startedAt).toLocaleTimeString('ar-IQ') : '—'}
                </TableCell>
                <TableCell className="text-gray-500">
                  {trip.endedAt ? new Date(trip.endedAt).toLocaleTimeString('ar-IQ') : '—'}
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Intl.DateTimeFormat('ar-IQ', { timeZone: 'Asia/Baghdad' }).format(
                    new Date(trip.createdAt),
                  )}
                </TableCell>
              </TableRow>
            ))}

            {tripRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  لا توجد سفرات.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <span className="text-sm text-gray-500">
              إجمالي {totalCount} سفرة | صفحة {page} من {totalPages}
            </span>
            <div className="flex gap-2" dir="ltr">
              <a href={buildUrl({ page: String(Math.max(1, page - 1)) })}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  className={page <= 1 ? 'pointer-events-none text-gray-300 border-gray-200' : ''}
                >
                  السابق
                </Button>
              </a>
              <a href={buildUrl({ page: String(Math.min(totalPages, page + 1)) })}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  className={
                    page >= totalPages ? 'pointer-events-none text-gray-300 border-gray-200' : ''
                  }
                >
                  التالي
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
