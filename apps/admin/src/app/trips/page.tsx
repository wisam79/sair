'use client';

import { useMany } from '@refinedev/core';
import { List, useDataGrid, DeleteButton } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { Chip, Stack, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS: Record<
  string,
  'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'
> = {
  scheduled: 'warning',
  driver_waiting: 'info',
  in_transit: 'primary',
  completed: 'success',
  absent: 'default',
  cancelled: 'error',
};

export default function TripList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'trips',
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

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: t('common.id', 'ID'),
        type: 'string',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'route_id',
        headerName: t('trips.fields.route', 'Route'),
        type: 'string',
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (routeIsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const route = routeData?.data?.find((item) => item.id === value);
          return route ? route.title : value;
        },
      },
      {
        field: 'status',
        headerName: t('trips.fields.status', 'Status'),
        type: 'string',
        minWidth: 150,
        flex: 1,
        renderCell: function render({ value }) {
          return (
            <Chip
              label={value?.replace('_', ' ')}
              color={STATUS_COLORS[value] || 'default'}
              size="small"
            />
          );
        },
      },
      {
        field: 'scheduled_at',
        headerName: t('trips.fields.scheduled', 'Scheduled'),
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : '-';
        },
      },
      {
        field: 'started_at',
        headerName: t('trips.fields.started', 'Started'),
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : '-';
        },
      },
      {
        field: 'ended_at',
        headerName: t('trips.fields.ended', 'Ended'),
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : '-';
        },
      },
      {
        field: 'last_lat',
        headerName: t('trips.fields.lat', 'Lat'),
        type: 'string',
        minWidth: 100,
        flex: 0.5,
        renderCell: function render({ value }) {
          return value ? parseFloat(value).toFixed(4) : '-';
        },
      },
      {
        field: 'last_lng',
        headerName: t('trips.fields.lng', 'Lng'),
        type: 'string',
        minWidth: 100,
        flex: 0.5,
        renderCell: function render({ value }) {
          return value ? parseFloat(value).toFixed(4) : '-';
        },
      },
      {
        field: 'actions',
        headerName: t('actions.actions', 'Actions'),
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <DeleteButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 80,
      },
    ],
    [routeData?.data, routeIsLoading, t],
  );

  return (
    <List breadcrumb={null}>
      <Box sx={{ width: '100%', overflowX: 'auto', display: 'grid' }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          autoHeight
          density="comfortable"
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
          }}
        />
      </Box>
    </List>
  );
}
