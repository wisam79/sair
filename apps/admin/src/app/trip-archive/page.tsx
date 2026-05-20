'use client';

import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Chip, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS: Record<string, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  scheduled: 'warning',
  driver_waiting: 'info',
  in_transit: 'info',
  completed: 'success',
  absent: 'default',
  cancelled: 'error',
};

export default function TripArchivePage() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'trips',
    filters: {
      initial: [{ field: 'status', operator: 'in', value: ['completed', 'cancelled', 'absent'] }],
    },
    sorters: { initial: [{ field: 'ended_at', order: 'desc' }] },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'route_id',
        headerName: t('tripArchive.routeId', 'Route ID'),
        type: 'string',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'driver_id',
        headerName: t('payouts.fields.driverId', 'Driver ID'),
        type: 'string',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'status',
        headerName: t('common.status', 'Status'),
        minWidth: 130,
        flex: 0.5,
        renderCell: ({ value }) => (
          <Chip
            label={value?.replace('_', ' ')}
            color={STATUS_COLORS[value] || 'default'}
            size="small"
          />
        ),
      },
      {
        field: 'scheduled_at',
        headerName: t('trips.fields.scheduled', 'Scheduled'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (value ? new Date(value).toLocaleString() : '-'),
      },
      {
        field: 'started_at',
        headerName: t('trips.fields.started', 'Started'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (value ? new Date(value).toLocaleString() : '-'),
      },
      {
        field: 'ended_at',
        headerName: t('trips.fields.ended', 'Ended'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (value ? new Date(value).toLocaleString() : '-'),
      },
    ],
    [t],
  );

  return (
    <List breadcrumb={null} title={t('nav.tripArchive', 'Trip Archive')}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
