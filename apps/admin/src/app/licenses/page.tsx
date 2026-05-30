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

  const licenseRouteIds = React.useMemo(() => {
    return (
      licensesGridProps?.rows
        ?.map((item: { route_id?: string }) => item?.route_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [licensesGridProps?.rows]);

  const { data: licenseRoutesData, isLoading: licenseRoutesIsLoading } = useMany({
    resource: 'routes',
    ids: licenseRouteIds,
    queryOptions: {
      enabled: activeTab === 0 && licenseRouteIds.length > 0,
    },
  });

  const licenseUserIds = React.useMemo(() => {
    const ids = new Set<string>();
    licensesGridProps?.rows?.forEach((item: { used_by?: string; reserved_by?: string }) => {
      if (item.used_by) ids.add(item.used_by);
      if (item.reserved_by) ids.add(item.reserved_by);
    });
    return Array.from(ids);
  }, [licensesGridProps?.rows]);

  const { data: licenseUsersData, isLoading: licenseUsersIsLoading } = useMany({
    resource: 'profiles',
    ids: licenseUserIds,
    queryOptions: {
      enabled: activeTab === 0 && licenseUserIds.length > 0,
    },
  });

  const licenseColumns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'code',
        headerName: t('licenses.fields.code', 'Code'),
        type: 'string',
        minWidth: 120,
        flex: 1,
      },
      {
        field: 'route_id',
        headerName: t('licenses.fields.route', 'Route'),
        type: 'string',
        minWidth: 180,
        flex: 1.5,
        renderCell: function render({ value }) {
          if (licenseRoutesIsLoading) return t('common.loading', 'Loading...');
          const route = licenseRoutesData?.data?.find((item) => item.id === value);
          return route ? route.title : value;
        },
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
        flex: 0.8,
      },
      {
        field: 'used_by',
        headerName: t('licenses.fields.usedBy', 'Used By (Student)'),
        type: 'string',
        minWidth: 180,
        flex: 1.2,
        renderCell: function render({ value }) {
          if (licenseUsersIsLoading) return t('common.loading', 'Loading...');
          const user = licenseUsersData?.data?.find((item) => item.id === value);
          return user ? `${user.full_name} (${user.phone || ''})` : '-';
        },
      },
      {
        field: 'used_at',
        headerName: t('licenses.fields.usedAt', 'Used At'),
        minWidth: 150,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : '-';
        },
      },
      {
        field: 'reserved_by',
        headerName: t('licenses.fields.reservedBy', 'Reserved By'),
        type: 'string',
        minWidth: 150,
        flex: 1,
        renderCell: function render({ value }) {
          if (licenseUsersIsLoading) return t('common.loading', 'Loading...');
          const user = licenseUsersData?.data?.find((item) => item.id === value);
          return user ? user.full_name : '-';
        },
      },
      {
        field: 'reserved_at',
        headerName: t('licenses.fields.reservedAt', 'Reserved At'),
        minWidth: 150,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : '-';
        },
      },
      {
        field: 'expires_at',
        headerName: t('licenses.fields.expiresAt', 'Expires At'),
        minWidth: 150,
        flex: 1,
        renderCell: function render({ value }) {
          return value ? new Date(value).toLocaleString() : '-';
        },
      },
      {
        field: 'actions',
        headerName: t('common.actions', 'Actions'),
        sortable: false,
        filterable: false,
        minWidth: 120,
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
    [
      reservingId,
      t,
      licenseRoutesIsLoading,
      licenseRoutesData,
      licenseUsersIsLoading,
      licenseUsersData,
    ],
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

  const routeIds = React.useMemo(() => {
    return (
      batchesGridProps?.rows
        ?.map((item: { route_id?: string }) => item?.route_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [batchesGridProps?.rows]);

  const { data: routesData, isLoading: routesIsLoading } = useMany({
    resource: 'routes',
    ids: routeIds,
    queryOptions: {
      enabled: activeTab === 1 && routeIds.length > 0,
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
