'use client';

import { useMany } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Stack, Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function RatingsPage() {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    resource: 'ratings',
    sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
  });

  // Unique profile IDs (students & drivers both point to profiles)
  const studentIds = React.useMemo(() => {
    return (
      dataGridProps?.rows
        ?.map((item: { student_id?: string }) => item?.student_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [dataGridProps?.rows]);

  const driverIds = React.useMemo(() => {
    return (
      dataGridProps?.rows
        ?.map((item: { driver_id?: string }) => item?.driver_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [dataGridProps?.rows]);

  const profileIds = React.useMemo(() => {
    return Array.from(new Set([...studentIds, ...driverIds]));
  }, [studentIds, driverIds]);

  const { data: profileData, isLoading: profilesLoading } = useMany({
    resource: 'profiles',
    ids: profileIds,
    queryOptions: {
      enabled: profileIds.length > 0,
      queryKey: ['profiles', profileIds],
    },
  });

  // Unique trip IDs
  const tripIds = React.useMemo(() => {
    return (
      dataGridProps?.rows
        ?.map((item: { trip_id?: string }) => item?.trip_id)
        .filter((id): id is string => typeof id === 'string') ?? []
    );
  }, [dataGridProps?.rows]);

  const { data: tripData, isLoading: tripsLoading } = useMany({
    resource: 'trips',
    ids: tripIds,
    meta: {
      select: 'id, scheduled_at, routes(title)',
    },
    queryOptions: {
      enabled: tripIds.length > 0,
      queryKey: ['trips', tripIds, 'routes-join'],
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'trip_id',
        headerName: t('ratings.fields.trip', 'Trip'),
        type: 'string',
        minWidth: 250,
        flex: 1.5,
        renderCell: function render({ value }) {
          if (tripsLoading) return <>{t('common.loading', 'Loading...')}</>;
          const trip = tripData?.data?.find((item) => item.id === value);
          if (!trip) return value;
          const route = trip.routes as { title?: string } | null;
          const time = trip.scheduled_at ? new Date(trip.scheduled_at).toLocaleString() : '';
          return route?.title ? `${route.title} (${time})` : time || value;
        },
      },
      {
        field: 'student_id',
        headerName: t('ratings.fields.student', 'Student'),
        type: 'string',
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (profilesLoading) return <>{t('common.loading', 'Loading...')}</>;
          const profile = profileData?.data?.find((item) => item.id === value);
          return profile ? profile.full_name : value;
        },
      },
      {
        field: 'driver_id',
        headerName: t('ratings.fields.driver', 'Driver'),
        type: 'string',
        minWidth: 180,
        flex: 1,
        renderCell: function render({ value }) {
          if (profilesLoading) return <>{t('common.loading', 'Loading...')}</>;
          const profile = profileData?.data?.find((item) => item.id === value);
          return profile ? profile.full_name : value;
        },
      },
      {
        field: 'rating',
        headerName: t('ratings.fields.rating', 'Rating'),
        minWidth: 180,
        flex: 1,
        renderCell: ({ value }) => <Rating value={value} readOnly precision={1} size="small" />,
      },
      {
        field: 'comment',
        headerName: t('ratings.fields.comment', 'Comment'),
        type: 'string',
        minWidth: 250,
        flex: 1,
        renderCell: ({ value }) => value || '-',
      },
      {
        field: 'created_at',
        headerName: t('ratings.fields.date', 'Date'),
        minWidth: 160,
        flex: 1,
        renderCell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      },
    ],
    [profileData?.data, profilesLoading, tripData?.data, tripsLoading, t],
  );

  return (
    <List breadcrumb={null} title={t('ratings.title', 'Ratings & Reviews')}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
