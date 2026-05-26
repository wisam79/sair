'use client';

import { useMany, useList } from '@refinedev/core';
import { List, useDataGrid, EditButton, ShowButton, DeleteButton } from '@refinedev/mui';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import React from 'react';
import { Stack, Box, Tabs, Tab, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const RouteMapViewer = dynamic(() => import('../../components/RouteMapViewer'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 500,
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px dashed #ccc',
        my: 2,
      }}
    >
      <CircularProgress size={24} />
      <Typography sx={{ ml: 1, color: 'text.secondary' }}>جاري تحميل الخريطة...</Typography>
    </Box>
  ),
});

export default function RouteList() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0); // 0 = Table, 1 = Map

  const { dataGridProps } = useDataGrid({
    resource: 'routes',
  });

  // Fetch all routes for map view (up to 100 to avoid performance blocks)
  const { data: allRoutesData, isLoading: routesLoading } = useList<any>({
    resource: 'routes',
    pagination: { pageSize: 100, mode: 'server' },
    queryOptions: {
      enabled: activeTab === 1,
    },
  });

  // Extract driver ids from map routes
  const mapDriverIds = React.useMemo(() => {
    return (allRoutesData?.data ?? [])
      .map((r) => r.driver_id)
      .filter((id): id is string => typeof id === 'string');
  }, [allRoutesData?.data]);

  // Fetch drivers for map view
  const { data: mapDriversData } = useMany({
    resource: 'drivers',
    ids: mapDriverIds,
    meta: {
      select: '*, profiles(full_name)',
    },
    queryOptions: {
      enabled: activeTab === 1 && mapDriverIds.length > 0,
      queryKey: ['drivers', mapDriverIds, 'map-profiles'],
    },
  });

  // Map driver_id -> full_name
  const driverNamesMap = React.useMemo(() => {
    const mapping: Record<string, string> = {};
    if (mapDriversData?.data) {
      mapDriversData.data.forEach((d) => {
        const fullName = (d.profiles as { full_name?: string } | null)?.full_name;
        if (d.id) {
          mapping[d.id] = fullName ?? d.license_number ?? d.id;
        }
      });
    }
    return mapping;
  }, [mapDriversData?.data]);

  // Fetch drivers for Table list
  const tableDriverIds = React.useMemo(() => {
    return (dataGridProps?.rows ?? [])
      .map((item: { driver_id?: string }) => item?.driver_id)
      .filter((id): id is string => typeof id === 'string');
  }, [dataGridProps?.rows]);

  const { data: tableDriversData, isLoading: tableDriversLoading } = useMany({
    resource: 'drivers',
    ids: tableDriverIds,
    meta: {
      select: '*, profiles(full_name)',
    },
    queryOptions: {
      enabled: tableDriverIds.length > 0,
      queryKey: ['drivers', tableDriverIds, 'table-profiles-join'],
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
          if (tableDriversLoading) {
            return <>{t('common.loading', 'Loading...')}</>;
          }

          const driver = tableDriversData?.data?.find((item) => item.id === value);
          const profile = driver?.profiles as { full_name?: string } | null;
          return profile?.full_name ?? driver?.license_number ?? value;
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
              <DeleteButton hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 150,
      },
    ],
    [tableDriversData?.data, tableDriversLoading, t],
  );

  return (
    <List breadcrumb={null}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="عرض الجدول" id="routes-tab-table" />
          <Tab label="عرض الخريطة" id="routes-tab-map" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <Box sx={{ width: '100%', overflowX: 'auto', display: 'grid' }}>
          <DataGrid
            {...dataGridProps}
            columns={columns}
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
        </Box>
      ) : (
        <Box sx={{ width: '100%', minHeight: 500 }}>
          {routesLoading ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <RouteMapViewer
              routes={(allRoutesData?.data as any) ?? []}
              driverNames={driverNamesMap}
              height="600px"
            />
          )}
        </Box>
      )}
    </List>
  );
}
