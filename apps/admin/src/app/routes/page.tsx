'use client';

import { useMany } from '@refinedev/core';
import { List, useDataGrid, EditButton, ShowButton } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function RouteList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'routes',
  });

  const { data: driverData, isLoading: driverIsLoading } = useMany({
    resource: 'drivers',
    ids:
      dataGridProps?.rows?.map((item: { driver_id?: string }) => item?.driver_id).filter(Boolean) ??
      [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
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
        field: 'title',
        headerName: t('routes.fields.title', 'Title'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'driver_id',
        headerName: t('routes.fields.driver', 'Driver'),
        type: 'string',
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (driverIsLoading) {
            return <>{t('common.loading', 'Loading...')}</>;
          }

          const driver = driverData?.data?.find((item) => item.id === value);
          return driver ? driver.license_number : value;
        },
      },
      {
        field: 'start_location',
        headerName: t('routes.fields.startLocation', 'Start Location'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'end_location',
        headerName: t('routes.fields.endLocation', 'End Location'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'price',
        headerName: t('routes.fields.price', 'Price'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'capacity',
        headerName: t('routes.fields.capacity', 'Capacity'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'available_seats',
        headerName: t('routes.fields.availableSeats', 'Available Seats'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'is_active',
        headerName: t('routes.fields.active', 'Active'),
        type: 'boolean',
        minWidth: 100,
        flex: 1,
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
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 120,
      },
    ],
    [driverData?.data, driverIsLoading, t],
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
