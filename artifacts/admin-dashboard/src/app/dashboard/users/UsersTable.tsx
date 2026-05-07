'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';

export interface UserRow {
  id: string;
  fullName: string;
  phone: string;
  role: string;
  isActivated: boolean;
  createdAt: string;
}

const roleVariant: Record<string, 'default' | 'success' | 'warning'> = {
  student: 'default',
  driver: 'success',
  admin: 'warning',
};

const roleLabel: Record<string, string> = {
  student: 'طالب',
  driver: 'سائق',
  admin: 'مدير',
};

const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: 'fullName',
    header: 'الاسم الكامل',
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.fullName}</span>,
  },
  {
    accessorKey: 'phone',
    header: 'رقم الهاتف',
    cell: ({ row }) => <span className="text-gray-600" dir="ltr">{row.original.phone}</span>,
  },
  {
    accessorKey: 'role',
    header: 'الدور',
    cell: ({ row }) => (
      <Badge variant={roleVariant[row.original.role] || 'default'}>
        {roleLabel[row.original.role] || row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'isActivated',
    header: 'حالة التفعيل',
    cell: ({ row }) =>
      row.original.isActivated ? (
        <span className="text-green-600 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          مفعل
        </span>
      ) : (
        <span className="text-gray-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          غير مفعل
        </span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الانضمام',
    cell: ({ row }) => (
      <span className="text-gray-500">
        {new Intl.DateTimeFormat('ar-IQ', { timeZone: 'Asia/Baghdad' }).format(new Date(row.original.createdAt))}
      </span>
    ),
  },
];

interface UsersTableProps {
  users: UserRow[];
}

export function UsersTable({ users }: UsersTableProps) {
  return <DataTable columns={columns} data={users} searchColumn="fullName" searchPlaceholder="بحث بالاسم..." />;
}
