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
        renderCell: (params: import('@mui/x-data-grid').GridRenderCellParams) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {((params?.row?.profiles as Record<string, unknown>)?.full_name as string) ||
                t('common.unknown', 'Unknown')}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {(params?.row?.profiles as Record<string, unknown>)?.phone as string}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'vehicle_model',
        headerName: t('drivers.fields.vehicleModel', 'Vehicle'),
        minWidth: 180,
        flex: 1.5,
        renderCell: (params: import('@mui/x-data-grid').GridRenderCellParams) => (
          <Box>
            <Typography variant="body2">{params?.row?.vehicle_model as string}</Typography>
            <Typography variant="caption" color="primary">
              {params?.row?.vehicle_plate as string}
            </Typography>
          </Box>
        ),
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
          return (
            <Switch
              checked={!!params?.row?.is_verified}
              onChange={() =>
                handleVerifyToggle(params?.row?.id as string, !!params?.row?.is_verified)
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
        renderCell: (params) => {
          return (
            <Typography variant="caption">
              <DateField value={params?.value} format="LLL" />
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
