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
  active: 'success',
  pending: 'warning',
  expired: 'default',
  cancelled: 'error',
};

export default function SubscriptionList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'subscriptions',
  });

  const { data: studentData, isLoading: studentIsLoading } = useMany({
    resource: 'profiles',
    ids:
      dataGridProps?.rows
        ?.map((item: { student_id?: string }) => item?.student_id)
        .filter((id): id is string => typeof id === 'string') ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
      queryKey: [
        'profiles',
        dataGridProps?.rows
          ?.map((item: { student_id?: string }) => item?.student_id)
          .filter((id): id is string => typeof id === 'string') ?? [],
      ],
    },
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
        field: 'student_id',
        headerName: t('subscriptions.fields.student', 'Student'),
        type: 'string',
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (studentIsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const student = studentData?.data?.find((item) => item.id === value);
          return student ? student.full_name : value;
        },
      },
      {
        field: 'route_id',
        headerName: t('subscriptions.fields.route', 'Route'),
        type: 'string',
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (routeIsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const route = routeData?.data?.find((item) => item.id === value);
          return route ? route.title : value;
        },
      },
      {
        field: 'status',
        headerName: t('subscriptions.fields.status', 'Status'),
        type: 'string',
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return <Chip label={value} color={STATUS_COLORS[value] || 'default'} size="small" />;
        },
      },
      {
        field: 'start_date',
        headerName: t('subscriptions.fields.startDate', 'Start'),
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleDateString() : '-';
        },
      },
      {
        field: 'end_date',
        headerName: t('subscriptions.fields.endDate', 'End'),
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleDateString() : '-';
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
    [studentData?.data, studentIsLoading, routeData?.data, routeIsLoading, t],
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
