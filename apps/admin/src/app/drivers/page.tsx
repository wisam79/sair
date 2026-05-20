'use client';

import { List, useDataGrid, DateField } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { Switch, Typography, Box } from '@mui/material';
import { useUpdate } from '@refinedev/core';
import { useTranslation } from 'react-i18next';

export default function DriverList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'drivers',
    meta: {
      select: '*, profiles(full_name, phone)',
    },
  });

  const { mutate } = useUpdate();

  const handleVerifyToggle = (id: string, currentStatus: boolean) => {
    mutate({
      resource: 'drivers',
      id,
      values: {
        is_verified: !currentStatus,
      },
    });
  };

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'full_name',
        headerName: t('profiles.fields.fullName', 'Full Name'),
        minWidth: 180,
        flex: 1.5,
        // MUI DataGrid v7: valueGetter receives (value, row) not (params)
        valueGetter: (_value: unknown, row: Record<string, unknown>) =>
          (row?.profiles as Record<string, unknown>)?.full_name,
        renderCell: (params: import('@mui/x-data-grid').GridRenderCellParams) => {
          const profiles = (params?.row as Record<string, unknown>)?.profiles as Record<string, unknown>;
          return (
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {(profiles?.full_name as string) || t('common.unknown', 'Unknown')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {profiles?.phone as string}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'vehicle_model',
        headerName: t('drivers.fields.vehicleModel', 'Vehicle'),
        minWidth: 180,
        flex: 1.5,
        renderCell: (params: import('@mui/x-data-grid').GridRenderCellParams) => {
          const row = params?.row as Record<string, unknown>;
          return (
            <Box>
              <Typography variant="body2">{row?.vehicle_model as string}</Typography>
              <Typography variant="caption" color="primary">
                {row?.vehicle_plate as string}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'capacity',
        headerName: t('drivers.fields.capacity', 'Seats'),
        type: 'number',
        minWidth: 80,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'is_verified',
        headerName: t('drivers.fields.verified', 'Verified'),
        minWidth: 100,
        renderCell: (params: import('@mui/x-data-grid').GridRenderCellParams) => {
          const row = params?.row as Record<string, unknown>;
          return (
            <Switch
              checked={!!row?.is_verified}
              onChange={() =>
                handleVerifyToggle(row?.id as string, !!row?.is_verified)
              }
              color="success"
              size="small"
            />
          );
        },
      },
      {
        field: 'created_at',
        headerName: t('drivers.fields.registeredAt', 'Registered At'),
        minWidth: 160,
        renderCell: (params: import('@mui/x-data-grid').GridRenderCellParams) => {
          const val = typeof params?.value === 'string' || typeof params?.value === 'number' || params?.value instanceof Date ? params.value : null;
          return (
            <Typography variant="caption">
              {val ? <DateField value={val} format="LLL" /> : '-'}
            </Typography>
          );
        },
      },
    ],
    [t],
  );

  return (
    <List
      breadcrumb={null}
      title={t('drivers.titles.list', 'Drivers Management')}
      wrapperProps={{ sx: { p: 2 } }}
    >
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
