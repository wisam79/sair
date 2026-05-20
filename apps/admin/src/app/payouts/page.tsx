'use client';

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

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'driver_id',
        headerName: t('payouts.fields.driverId', 'Driver ID'),
        type: 'string',
        minWidth: 250,
        flex: 1,
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
        renderCell: ({ value }) => (
          <Chip
            label={
              value
                ? String(
                    t(`payouts.status.${value}`, value.charAt(0).toUpperCase() + value.slice(1)),
                  )
                : '-'
            }
            color={PAYOUT_COLORS[value] || 'default'}
            size="small"
          />
        ),
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
        renderCell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      },
      {
        field: 'updated_at',
        headerName: t('payouts.fields.updated', 'Updated'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      },
    ],
    [t],
  );

  return (
    <List breadcrumb={null} title={t('payouts.title', 'Driver Payouts')}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
