'use client';

import { List, useDataGrid, DateField } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LicensesList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'licenses',
    sorters: {
      initial: [
        {
          field: 'created_at',
          order: 'desc',
        },
      ],
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'code',
        headerName: t('licenses.fields.code', 'Code'),
        type: 'string',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'status',
        headerName: t('licenses.fields.status', 'Status'),
        type: 'string',
        minWidth: 120,
        flex: 1,
        renderCell: function render({ value }) {
          let color:
            | 'default'
            | 'primary'
            | 'secondary'
            | 'error'
            | 'info'
            | 'success'
            | 'warning' = 'default';
          if (value === 'active') color = 'success';
          if (value === 'used') color = 'default';
          if (value === 'revoked') color = 'error';
          return <Chip size="small" label={value} color={color} />;
        },
      },
      {
        field: 'valid_days',
        headerName: t('license_batches.fields.validDays', 'Valid Days'),
        type: 'number',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'used_at',
        headerName: t('licenses.fields.usedAt', 'Used At'),
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          if (!value) return '-';
          return <DateField value={value} />;
        },
      },
      {
        field: 'created_at',
        headerName: t('license_batches.fields.createdAt', 'Created At'),
        minWidth: 200,
        flex: 1,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
    ],
    [t],
  );

  return (
    <List breadcrumb={null}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
