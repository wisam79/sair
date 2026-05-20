'use client';

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

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: t('common.id', 'ID'), type: 'string', minWidth: 100, flex: 1 },
      {
        field: 'trip_id',
        headerName: t('ratings.fields.tripId', 'Trip ID'),
        type: 'string',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'student_id',
        headerName: t('ratings.fields.studentId', 'Student ID'),
        type: 'string',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'driver_id',
        headerName: t('payouts.fields.driverId', 'Driver ID'),
        type: 'string',
        minWidth: 250,
        flex: 1,
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
    [t],
  );

  return (
    <List breadcrumb={null} title={t('ratings.title', 'Ratings & Reviews')}>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
}
