'use client';

import {
  List,
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { Stack, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function InstitutionList() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'institutions',
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
        field: 'name',
        headerName: t('institutions.fields.name', 'Name'),
        type: 'string',
        minWidth: 220,
        flex: 1,
      },
      {
        field: 'city',
        headerName: t('institutions.fields.city', 'City'),
        type: 'string',
        minWidth: 150,
        flex: 1,
        renderCell: function render({ value }) {
          return typeof value === 'string' ? value : '-';
        },
      },
      {
        field: 'created_at',
        headerName: t('institutions.fields.created', 'Created'),
        minWidth: 160,
        flex: 1,
        renderCell: function render({ value }) {
          return typeof value === 'string' || typeof value === 'number'
            ? new Date(value).toLocaleDateString()
            : '-';
        },
      },
      {
        field: 'actions',
        headerName: t('actions.actions', 'Actions'),
        sortable: false,
        renderCell: function render({ row }: { row: { id: string | number } }) {
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
    <List breadcrumb={null} headerButtons={<CreateButton />}>
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
