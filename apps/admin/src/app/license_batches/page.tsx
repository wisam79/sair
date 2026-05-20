'use client';

import { List, useDataGrid, DateField } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { useMany } from '@refinedev/core';
import { useTranslation } from 'react-i18next';

export default function LicenseBatchesList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'license_batches',
    sorters: {
      initial: [
        {
          field: 'created_at',
          order: 'desc',
        },
      ],
    },
  });

  const { data: routesData, isLoading: routesIsLoading } = useMany({
    resource: 'routes',
    ids:
      dataGridProps?.rows?.map((item: { route_id?: string }) => item?.route_id).filter(Boolean) ??
      [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'batch_name',
        headerName: t('license_batches.fields.name', 'Batch Name'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'route_id',
        headerName: t('license_batches.fields.route', 'Route'),
        type: 'string',
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (routesIsLoading) {
            return t('common.loading', 'Loading...');
          }
          const route = routesData?.data?.find((item) => item.id === value);
          const title = route && 'title' in route ? String(route.title) : '';
          return title || (typeof value === 'string' ? value : '');
        },
      },
      {
        field: 'quantity',
        headerName: t('license_batches.fields.quantity', 'Quantity'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'price',
        headerName: t('license_batches.fields.price', 'Price'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'valid_days',
        headerName: t('license_batches.fields.validDays', 'Valid Days'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'created_at',
        headerName: t('license_batches.fields.createdAt', 'Created At'),
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          const val = typeof value === 'string' || typeof value === 'number' || value instanceof Date ? value : null;
          return val ? <DateField value={val} /> : null;
        },
      },
    ],
    [routesData?.data, routesIsLoading, t],
  );

  return (
    <List breadcrumb={null}>
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
    </List>
  );
}
