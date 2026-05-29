'use client';

import { List, useDataGrid, DateField } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useMany } from '@refinedev/core';
import { Chip, Box, Tabs, Tab, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabaseClient } from '../../providers/supabaseClient';

export default function LicensesPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'batches' ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [reservingId, setReservingId] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    router.push(`/licenses?tab=${newValue === 1 ? 'batches' : 'individual'}`);
  };

  const handleReserveLicense = async (licenseId: string) => {
    const confirmed = window.confirm(
      t(
        'licenses.actions.reserveConfirm',
        'Reserve this license as sold and deduct one seat from its route?',
      ),
    );
    if (!confirmed) return;

    setReservingId(licenseId);
    try {
      const { error } = await supabaseClient.rpc('reserve_license_for_sale', {
        p_license_id: licenseId,
      });
      if (error) {
        alert(error.message);
        return;
      }
      router.refresh();
    } finally {
      setReservingId(null);
    }
  };

  // ─── TAB 0: INDIVIDUAL LICENSES ──────────────────────────────────────────
  const { dataGridProps: licensesGridProps } = useDataGrid({
    resource: 'licenses',
    sorters: {
      initial: [
        {
          field: 'created_at',
          order: 'desc',
        },
      ],
    },
    queryOptions: {
      enabled: activeTab === 0,
    },
  });

  const licenseColumns = React.useMemo<GridColDef[]>(
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
          if (value === 'available') color = 'success';
          if (value === 'reserved') color = 'warning';
          if (value === 'payment_hold') color = 'info';
          if (value === 'used') color = 'default';
          if (value === 'expired') color = 'secondary';
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
      {
        field: 'actions',
        headerName: t('common.actions', 'Actions'),
        sortable: false,
        filterable: false,
        minWidth: 150,
        renderCell: function render({ row }) {
          if (row.status !== 'available') return null;
          return (
            <Button
              size="small"
              variant="outlined"
              disabled={reservingId === row.id}
              onClick={() => void handleReserveLicense(row.id)}
            >
              {t('licenses.actions.reserve', 'Reserve')}
            </Button>
          );
        },
      },
    ],
    [reservingId, t],
  );

  // ─── TAB 1: LICENSE BATCHES ──────────────────────────────────────────────
  const { dataGridProps: batchesGridProps } = useDataGrid({
    resource: 'license_batches',
    sorters: {
      initial: [
        {
          field: 'created_at',
          order: 'desc',
        },
      ],
    },
    queryOptions: {
      enabled: activeTab === 1,
    },
  });

  const { data: routesData, isLoading: routesIsLoading } = useMany({
    resource: 'routes',
    ids:
      batchesGridProps?.rows
        ?.map((item: { route_id?: string }) => item?.route_id)
        .filter((id): id is string => typeof id === 'string') ?? [],
    queryOptions: {
      enabled: activeTab === 1 && !!batchesGridProps?.rows,
      queryKey: [
        'routes',
        batchesGridProps?.rows
          ?.map((item: { route_id?: string }) => item?.route_id)
          .filter((id): id is string => typeof id === 'string') ?? [],
      ],
    },
  });

  const batchColumns = React.useMemo<GridColDef[]>(
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
        renderCell: ({ value }) => (value ? Number(value).toLocaleString() : '-'),
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
          const val =
            typeof value === 'string' || typeof value === 'number' || value instanceof Date
              ? value
              : null;
          return val ? <DateField value={val} /> : null;
        },
      },
    ],
    [routesData?.data, routesIsLoading, t],
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: 'transparent' }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontFamily: 'var(--font-noto-arabic), sans-serif',
              fontWeight: 600,
            },
          }}
        >
          <Tab label={t('licenses.titles.list', 'Licenses')} />
          <Tab label={t('license_batches.titles.list', 'License Batches')} />
        </Tabs>
      </Paper>

      {/* TAB 0: LICENSES */}
      {activeTab === 0 && (
        <List breadcrumb={null} title="">
          <DataGrid
            {...licensesGridProps}
            columns={licenseColumns}
            autoHeight
            density="comfortable"
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        </List>
      )}

      {/* TAB 1: BATCHES */}
      {activeTab === 1 && (
        <List
          breadcrumb={null}
          title=""
          headerButtons={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => router.push('/license_batches/create')}
              sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
            >
              {t('license_batches.titles.create', 'Create Batch')}
            </Button>
          }
        >
          <DataGrid
            {...batchesGridProps}
            columns={batchColumns}
            autoHeight
            density="comfortable"
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
          />
        </List>
      )}
    </>
  );
}
