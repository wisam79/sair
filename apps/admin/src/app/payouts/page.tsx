'use client';

import { useMany } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PAYOUT_COLORS: Record<string, 'default' | 'success' | 'error' | 'warning'> = {
  pending: 'warning',
  completed: 'success',
  rejected: 'error',
};

export default function PayoutsPage() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'driver_payouts',
  });

  const { data: driverData, isLoading: driverIsLoading } = useMany({
    resource: 'drivers',
    ids:
      dataGridProps?.rows
        ?.map((item: { driver_id?: string }) => item?.driver_id)
        .filter((id): id is string => typeof id === 'string') ?? [],
    meta: {
      select: '*, profiles(full_name)',
    },
    queryOptions: {
      enabled: !!dataGridProps?.rows,
      queryKey: [
        'drivers',
        dataGridProps?.rows
          ?.map((item: { driver_id?: string }) => item?.driver_id)
          .filter((id): id is string => typeof id === 'string') ?? [],
        'profiles-join',
      ],
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'driver_id',
        headerName: t('payouts.fields.driver', 'Driver'),
        type: 'string',
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (driverIsLoading) {
            return <>{t('common.loading', 'Loading...')}</>;
          }

          const driver = driverData?.data?.find((item) => item.id === value);
          const profile = driver?.profiles as { full_name?: string } | null;
          return profile?.full_name ?? driver?.license_number ?? value;
        },
      },
      {
        field: 'amount',
        headerName: t('payouts.fields.amountIqd', 'Amount (IQD)'),
        type: 'number',
        minWidth: 150,
        flex: 1,
        renderCell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
      },
      {
        field: 'status',
        headerName: t('common.status', 'Status'),
        minWidth: 120,
        flex: 0.5,
        renderCell: ({ value }) => {
          const valStr = typeof value === 'string' ? value : '';
          return (
            <Chip
              label={
                valStr
                  ? t(`payouts.status.${valStr}`, valStr.charAt(0).toUpperCase() + valStr.slice(1))
                  : '-'
              }
              color={PAYOUT_COLORS[valStr] || 'default'}
              size="small"
            />
          );
        },
      },
      {
        field: 'reference_note',
        headerName: t('payouts.fields.reference', 'Reference'),
        type: 'string',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'created_at',
        headerName: t('payouts.fields.requested', 'Requested'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) =>
          typeof value === 'string' || typeof value === 'number'
            ? new Date(value).toLocaleDateString()
            : '-',
      },
      {
        field: 'updated_at',
        headerName: t('payouts.fields.updated', 'Updated'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) =>
          typeof value === 'string' || typeof value === 'number'
            ? new Date(value).toLocaleDateString()
            : '-',
      },
    ],
    [driverData?.data, driverIsLoading, t],
  );

  return (
    <List breadcrumb={null} title={t('payouts.title', 'Driver Payouts')}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
