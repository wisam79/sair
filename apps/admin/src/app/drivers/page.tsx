'use client';

import { List, useDataGrid, DateField } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Chip, Stack, Switch } from '@mui/material';
import { useUpdate } from '@refinedev/core';

export default function DriverList() {
  const { dataGridProps } = useDataGrid({
    resource: 'profiles',
    filters: {
      initial: [
        {
          field: 'role',
          operator: 'eq',
          value: 'driver',
        },
      ],
    },
  });

  const { mutate } = useUpdate();

  const handleVerifyToggle = (id: string, currentStatus: boolean) => {
    mutate({
      resource: 'profiles',
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
        headerName: 'Full Name',
        type: 'string',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'phone',
        headerName: 'Phone',
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'is_verified',
        headerName: 'Verified',
        minWidth: 120,
        flex: 1,
        renderCell: function render({ row }) {
          return (
            <Switch
              checked={!!row.is_verified}
              onChange={() => handleVerifyToggle(row.id, !!row.is_verified)}
              color="success"
            />
          );
        },
      },
      {
        field: 'created_at',
        headerName: 'Registered At',
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
    ],
    [],
  );

  return (
    <List title="Drivers Management">
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
