'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';

export interface SubscriptionRow {
  id: string;
  studentName: string;
  driverName: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  commissionAmount: number;
  driverPayout: number;
  paymentStatus: string;
  status: string;
  tripsUsed: number;
  tripsPerMonth: number;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ar-IQ') + ' د.ع';
}

const statusBadgeVariant: Record<string, 'default' | 'destructive' | 'secondary' | 'success' | 'warning'> = {
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

const paymentBadgeVariant: Record<string, 'default' | 'destructive' | 'secondary' | 'success' | 'warning'> = {
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

const columns: ColumnDef<SubscriptionRow>[] = [
  {
    accessorKey: 'studentName',
    header: 'الطالب',
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.studentName || '-'}</span>,
  },
  {
    accessorKey: 'driverName',
    header: 'السائق',
    cell: ({ row }) => <span className="text-gray-700">{row.original.driverName || '-'}</span>,
  },
  {
    accessorKey: 'startDate',
    header: 'تاريخ البداية',
    cell: ({ row }) => (
      <span className="text-gray-600">
        {row.original.startDate ? new Date(row.original.startDate).toLocaleDateString('ar-IQ') : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'تاريخ النهاية',
    cell: ({ row }) => (
      <span className="text-gray-600">
        {row.original.endDate
          ? new Intl.DateTimeFormat('ar-IQ', { timeZone: 'Asia/Baghdad' }).format(new Date(row.original.endDate))
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'monthlyFee',
    header: 'الرسوم الشهرية',
    cell: ({ row }) => <span className="text-gray-900 font-medium" dir="ltr">{formatCurrency(row.original.monthlyFee)}</span>,
  },
  {
    accessorKey: 'commissionAmount',
    header: 'العمولة',
    cell: ({ row }) => <span className="text-gray-900" dir="ltr">{formatCurrency(row.original.commissionAmount)}</span>,
  },
  {
    accessorKey: 'driverPayout',
    header: 'صافي السائق',
    cell: ({ row }) => <span className="text-gray-900" dir="ltr">{formatCurrency(row.original.driverPayout)}</span>,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'حالة الدفع',
    cell: ({ row }) => (
      <Badge variant={paymentBadgeVariant[row.original.paymentStatus] || 'secondary'}>
        {paymentLabel[row.original.paymentStatus] || row.original.paymentStatus}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => (
      <Badge variant={statusBadgeVariant[row.original.status] || 'secondary'}>
        {statusLabel[row.original.status] || row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'tripsUsed',
    header: 'السفرات',
    cell: ({ row }) => (
      <span className="text-gray-700 text-center" dir="ltr">
        {row.original.tripsUsed} / {row.original.tripsPerMonth}
      </span>
    ),
  },
];

interface SubscriptionsTableProps {
  subscriptions: SubscriptionRow[];
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  return <DataTable columns={columns} data={subscriptions} searchColumn="studentName" searchPlaceholder="بحث باسم الطالب..." />;
}
