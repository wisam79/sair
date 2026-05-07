'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';

export interface RouteRow {
  id: string;
  driverName: string;
  driverPhone: string;
  fromArea: string;
  fromCity: string;
  toUniversity: string;
  departureMorning: string;
  departureEvening: string;
  totalSeats: number;
  availableSeats: number;
  totalStudents: number;
  isActive: boolean;
}

const columns: ColumnDef<RouteRow>[] = [
  {
    accessorKey: 'fromArea',
    header: 'منطقة الانطلاق',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.fromArea}</div>
        <div className="text-xs text-gray-500">{row.original.fromCity}</div>
      </div>
    ),
  },
  {
    accessorKey: 'toUniversity',
    header: 'الجامعة',
    cell: ({ row }) => <span className="text-gray-700">{row.original.toUniversity}</span>,
  },
  {
    accessorKey: 'driverName',
    header: 'السائق',
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.driverName}</div>
        <div className="text-xs text-gray-500" dir="ltr">{row.original.driverPhone}</div>
      </div>
    ),
  },
  {
    accessorKey: 'departureMorning',
    header: 'وقت الذهاب',
    cell: ({ row }) => <span className="text-gray-600" dir="ltr">{row.original.departureMorning}</span>,
  },
  {
    accessorKey: 'departureEvening',
    header: 'وقت العودة',
    cell: ({ row }) => <span className="text-gray-600" dir="ltr">{row.original.departureEvening}</span>,
  },
  {
    accessorKey: 'availableSeats',
    header: 'المقاعد',
    cell: ({ row }) => (
      <Badge variant={row.original.availableSeats > 0 ? 'success' : 'destructive'}>
        {row.original.availableSeats}/{row.original.totalSeats}
      </Badge>
    ),
  },
  {
    accessorKey: 'totalStudents',
    header: 'الطلاب',
    cell: ({ row }) => <span className="text-gray-700">{row.original.totalStudents}</span>,
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center gap-1 text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          نشط
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-gray-400">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          غير نشط
        </span>
      ),
  },
];

interface RoutesTableProps {
  routes: RouteRow[];
}

export function RoutesTable({ routes }: RoutesTableProps) {
  return <DataTable columns={columns} data={routes} searchColumn="fromArea" searchPlaceholder="بحث بمنطقة الانطلاق..." />;
}
