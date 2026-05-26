'use client';

import { useDataGrid, List, ShowButton, EditButton, DeleteButton } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Stack, Chip, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ROLE_COLORS: Record<
  string,
  'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'
> = {
  admin: 'error',
  student: 'primary',
  driver: 'success',
};

export default function ProfileList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'profiles',
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
        field: 'full_name',
        headerName: t('profiles.fields.fullName', 'Full Name'),
        type: 'string',
        minWidth: 180,
        flex: 1,
      },
      {
        field: 'phone',
        headerName: t('profiles.fields.phone', 'Phone'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'role',
        headerName: t('profiles.fields.role', 'Role'),
        type: 'string',
        minWidth: 120,
        flex: 0.5,
        renderCell: function render({ value }) {
          return <Chip label={value} color={ROLE_COLORS[value] || 'default'} size="small" />;
        },
      },
      {
        field: 'created_at',
        headerName: t('profiles.fields.joined', 'Joined'),
        minWidth: 180,
        flex: 1,
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
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 150,
      },
    ],
    [t],
  );

  return (
    <List breadcrumb={null}>
      <Box sx={{ width: '100%', overflowX: 'auto', display: 'grid' }}>
        <DataGrid {...dataGridProps} columns={columns} autoHeight />
      </Box>
    </List>
  );
}
