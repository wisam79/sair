'use client';

import { useMany } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Chip } from '@mui/material';
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

  const { data: routeData, isLoading: routeIsLoading } = useMany({
    resource: 'routes',
    ids:
      dataGridProps?.rows
        ?.map((item: { route_id?: string }) => item?.route_id)
        .filter((id): id is string => typeof id === 'string') ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
      queryKey: [
        'routes',
        dataGridProps?.rows
          ?.map((item: { route_id?: string }) => item?.route_id)
          .filter((id): id is string => typeof id === 'string') ?? [],
      ],
    },
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
        field: 'route_id',
        headerName: t('trips.fields.route', 'Route'),
        type: 'string',
        minWidth: 200,
        flex: 1.2,
        renderCell: function render({ value }) {
          if (routeIsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const route = routeData?.data?.find((item) => item.id === value);
          return route ? route.title : value;
        },
      },
      {
        field: 'driver_id',
        headerName: t('routes.fields.driver', 'Driver'),
        type: 'string',
        minWidth: 200,
        flex: 1.2,
        renderCell: function render({ value }) {
          if (driverIsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const driver = driverData?.data?.find((item) => item.id === value);
          const profile = driver?.profiles as { full_name?: string } | null;
          return profile?.full_name ?? driver?.license_number ?? value;
        },
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
    [routeData?.data, routeIsLoading, driverData?.data, driverIsLoading, t],
  );

  return (
    <List breadcrumb={null} title={t('nav.tripArchive', 'Trip Archive')}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
